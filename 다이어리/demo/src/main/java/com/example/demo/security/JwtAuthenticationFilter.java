package com.example.demo.security;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component  // 개발자가 class코드를 수정하는 것을 허용
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;
    @Override
    protected void doFilterInternal (HttpServletRequest request, HttpServletResponse response, FilterChain filterchain) throws ServletException, IOException {
        try {
            String token = parseBearerToken(request);
            log.info("필터가 실행중입니다");
            // 토큰 검사하기
            if (token != null && !token.equalsIgnoreCase("null")) {
                String userId = tokenProvider.validateAndGetUserId(token);
                log.info("인증된 유저 id는 : " + userId);
                // 인증이 마무리 되면 인증된 사용자라고 통보해 줍니다
                AbstractAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        AuthorityUtils.NO_AUTHORITIES
                );
                // 현재 요청에 대한 세부정보를 authentication 객체에 설정합니다
             authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
             // 인증된 사용자의 세부정보를 저장합니다
             SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
             // 아래 코드 확인 ( 라이브러리의 하위기능이라 생각. 실상은 객체안의 메서드)
             securityContext.setAuthentication(authentication);
             SecurityContextHolder.setContext(securityContext);
            }
        }
        catch (Exception ex) {
            logger.error("유저 인증이 안됩니다", ex);
        }
        filterchain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        // http 요청을 해석해서 bearer토큰을 반환한다
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }


}

// HttpServletResponse, HttpServletRequest 웹 어플리케이션에서 요청과 응답을 처리할 때 씁니다.
// HttpServletRequest 요청 : 메서드타입 (get, post, put, delete)
// HttpServletResponse 응답 : 상태코드 (200, 404, 500)



