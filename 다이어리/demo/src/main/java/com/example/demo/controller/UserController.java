package com.example.demo.controller;

import com.example.demo.dto.ResponseDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.UserEntity;
import com.example.demo.security.TokenProvider;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            // userDTO가 NULL값이거나 비번이 null이면 예외발생
            if (userDTO == null || userDTO.getPassword() == null) {
                throw new RuntimeException("비번이 잘못되었어요");
            }
            // 요청을 이용해서 저장할 유저 엔티티를 만든다
            UserEntity user = UserEntity.builder()
                    .username(userDTO.getUsername())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .build();
            // 만들어진 유저 엔티티를 리포지토리에 저장한다
            UserEntity registeredUser = userService.create(user);
            // 유저 정보를 UserDTO로 변환한다
            UserDTO responseUserDTO = UserDTO.builder()
                    .id(registeredUser.getId())
                    .username(registeredUser.getUsername())
                    .build();
            // entity변환된 userdto를 응답으로 반환함
            return ResponseEntity.ok().body(responseUserDTO);

        }
        catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        // 유저의 자격 증명을 확인하여 유저 엔티티를 가져온다
        UserEntity user = userService.getByCredentials(
          userDTO.getUsername(),
          userDTO.getPassword(),
          passwordEncoder);
        // 유저가 존재하는 경우
        if (user != null) {
            // 토큰을 생성한다
            final String token = tokenProvider.create(user);
            // 유저정보에 토큰을 포함한 UserDTO를 생성합니다
            final UserDTO responseUserDTO = UserDTO.builder()
                    .username(user.getUsername())
                    .id(user.getId())
                    .token(token)
                    .build();
            // userdto를 응답으로 반환한다
            return ResponseEntity
                    .ok()
                    .body(responseUserDTO);
        }
        else {
            // 유저가 존재하지 않으면 로그인 실패시킴
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("로그인 실패")
                    .build();
            return ResponseEntity
                    .badRequest()
                    .body(responseDTO);
        }
    }

}
