

package com.book_book.springbootlibrary.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    // 이 메서드는 Spring Security의 보안 설정을 정의하고 SecurityFilterChain을 구성합니다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 크로스 사이트 요청 위조 (CSRF) 방지 비활성화
        http.csrf().disable();

        // 모든 엔드포인트에 대한 무제한 접근 허용
        http.authorizeRequests()
                .anyRequest().permitAll();

        // 보안 컨텍스트 및 세션 관리 비활성화
        http.securityContext().disable();
        http.sessionManagement().disable();

        // SecurityFilterChain 객체를 빌드하여 반환
        return http.build();
    }
}







