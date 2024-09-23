package com.book_book.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;


//Java 클래스 ExtractJWT는 JSON Web Token (JWT)에서 특정 데이터를 추출하는 유틸리티 역할을 합니다.
//이 클래스는 JWT의 페이로드 부분에서 원하는 키의 값을 추출하는 기능을 제공하는 메서드를 포함하고 있습니다.


public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction) {

        token.replace("Bearer ", "");

        String[] chunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunks[1]));

        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<String, String>();

        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }
        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }
        return null;
    }
}
