import config from "../config"
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
    const IdTokenKey = "bkash:idToken";
    const RefreshTokenKey = "bkash:refreshToken";

    let bkashIdToken = await redisClient.get(IdTokenKey);
    let bkashRefreshToken = await redisClient.get(RefreshTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey)
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey)
    

    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshToken && bkashRefreshTokenTTL > 600) {
        const refreshTokenResponse = await fetch(`${config.bkash_base_url}/tokenized/checkout/token/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                username: config.bkash_username,
                password: config.bkash_password
            },
            body: JSON.stringify({
                app_key: config.bkash_app_key,
                app_secret: config.bkash_app_secret,
                refresh_token: bkashRefreshToken
            })
        });
        const bkashRefreshTokenResult = await refreshTokenResponse.json()
        bkashIdToken = bkashRefreshTokenResult.id_token as string
        await redisClient.set(IdTokenKey,bkashIdToken,{
            expiration: {
                type: "EX",
                value:  60 * 60
            },
        })
        return bkashIdToken
    }
 if (bkashIdTokenTTL > 600) {
        return bkashIdToken;
    }
    const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/token/grant`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config.bkash_username,
            password: config.bkash_password
        },
        body: JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret
        })
    });
    if (!response.ok) {
        throw new Error("Error in getting token");
    }
    const result = await response.json();
    await redisClient.set(IdTokenKey, result.id_token, {
        expiration: {
            type: "EX",
            value: 60 * 60,
        },
    });
    await redisClient.set(RefreshTokenKey, result.refresh_token, {
        expiration: {
            type: "EX",
            value: 60 * 60 * 24 * 28,
        },
    });
    bkashIdToken = result.id_token
    console.log({
        bkashIdToken,
        bkashRefreshToken,
        bkashIdTokenTTL,
        bkashRefreshTokenTTL
    })
    return bkashIdToken;
}

