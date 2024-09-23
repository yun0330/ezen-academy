package com.example.demo.controller;

import com.example.demo.dto.ResponseDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.TodoEntity;
import com.example.demo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("todo")
public class TodoController {


    @Autowired
    private TodoService service;
    // @AuthenticationPrincipal 인증정보에 대한 부분을 정의한 인터페이스이며
    // 이는 인증되는 주체의 id이다
    @PostMapping
    public ResponseEntity<?> createTodo(
            @AuthenticationPrincipal String userId,
            @RequestBody TodoDTO dto
    ) {
        try {
            // todoDto를 todoEntity로 변환
            TodoEntity entity = TodoDTO.toEntity(dto);
            // 게시글 생성당시엔 id가 없으니 id를 null초기화
            entity.setId(null);
            // userId 받아오기 (설정)
            entity.setUserId(userId);
            // todo 엔티티를 생성
            List<TodoEntity> entities = service.create(entity);
            // 엔티티 데이터를 dto 리스트 데이터로 변환한다
            List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
         // List<TodoDTO> dtos = entities.stream().map(entity -> new TodoDTO(entity)).collect(Collectors.toList());
            // 변환된 TodoDTO 리스트로 ResponseDTO를 업데이트함
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();
            return ResponseEntity.ok().body(response);
        }
        catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> retrieveTodoList
            (@AuthenticationPrincipal String userId) {
        // retrieve 메서드를 통해서 todo리스트 데이터를 가져온다
        List<TodoEntity> entities = service.retrieve(userId);
        // 받아온 데이터를 dto에 반영한다
        List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
        // responseDto를 초기화한다
        ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();
        return ResponseEntity.ok().body(response);
    }

    @PutMapping
    public ResponseEntity<?> updateTodo
            (@AuthenticationPrincipal String userId,
             @RequestBody TodoDTO dto) {
        // 글의 수정이니 todoDTO를 엔티티로 변환한다
        TodoEntity entity = TodoDTO.toEntity(dto);
        // 해당 userId로 조회
        entity.setUserId(userId);
        // 글 업데이트 (Todoservice 클래스에서 만들어 둔 update 메서드 사용)
        List<TodoEntity> entities = service.update(entity);
        // 엔티티 데이터로 dto도 업데이트
        List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
        // responseDTO 업데이트
        ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();

        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteTodo
            (@AuthenticationPrincipal String userId,
             @RequestBody TodoDTO dto) {
        try{
            TodoEntity entity = TodoDTO.toEntity(dto);
            entity.setUserId(userId);
            List<TodoEntity> entities = service.delete(entity);
            List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();
            return ResponseEntity.ok().body(response);
        }
        catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }
    }

}



