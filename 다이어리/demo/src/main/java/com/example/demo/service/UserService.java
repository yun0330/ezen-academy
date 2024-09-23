package com.example.demo.service;

import com.example.demo.model.UserEntity;
import com.example.demo.persistence.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;
    // 새로운 사용자 등록 메서드
    public UserEntity create(final UserEntity userEntity) {
        if (userEntity == null || userEntity.getUsername() == null) {
            throw new RuntimeException("잘못되었습니다");
        }
        final String username = userEntity.getUsername();
        // 중복 사용자가 존재하는지 확인
        if (userRepository.existsByUsername(username)) {
            log.warn("사용자 이름이 이미 존재함 {}", username);
            throw new RuntimeException("사용자 이름이 이미 존재함");
        }
        return userRepository.save(userEntity);
    }
    // 사용자 인증 메서드
    public UserEntity getByCredentials
    (final String username, final String password, final PasswordEncoder encoder) {
        final UserEntity originalUser = userRepository.findByUsername(username);
        // matches() 메서드를 이용해서 암호가 같은지 확인
        if (originalUser != null && encoder.matches(password, originalUser.getPassword())) {
            // 비번이 맞으면 사용자 반환
            return originalUser;
        }
        return null;
    }
}
