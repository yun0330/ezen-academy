package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 설정 클래스임을 나타냅니다
public class WebMvcConfig implements WebMvcConfigurer {
    // WebMvcConfigurer 인터페이스를 구현하였습니다 + 스프링 mvc설정을 진행

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //모든 경로에대해 cors설정 적용
        .allowedOrigins("http://localhost:3000") //특정 경로에서의 요청만 허용
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") //허용할 메서드모음
        .allowedHeaders("*") //모든 헤더 허용
        .allowCredentials(true); // 자격증명 허용
    }
}
