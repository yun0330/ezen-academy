package com.example.demo.service;

import com.example.demo.model.TodoEntity;
import com.example.demo.persistence.TodoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TodoService {

    @Autowired
    private TodoRepository repository;
    public String testService() {
        // builder메서드는 향후에 TodoEntity에 데이터 필드가 추가되어도
        // 유연하게 대응될 수 있습니다.
        // 객체는 일반적으로 한번 만들어지면 바꿀수 없습니다.
        // 추가 개발 시 이런 문제점을 해결하기위해 builder메서드가 애용됩니다
        TodoEntity entity = TodoEntity.builder().title("할일리스트").build();
        repository.save(entity);
        TodoEntity savedEntity = repository.findById(entity.getId()).get();
        return savedEntity.getTitle();
    }

public List<TodoEntity> create(final TodoEntity entity) {
        validate(entity);
        repository.save(entity);
        log.info("entity id : {} 가 저장되었습니다", entity.getId());
        return repository.findByUserId(entity.getUserId());
}

    private void validate(TodoEntity entity) {
        if (entity == null) {
            log.warn("게시글을 작성하여 주시기 바랍니다");
            throw new RuntimeException("반드시 작성해 주세요");
        }

        if (entity.getUserId() == null) {
            log.warn("누구세요???");
            throw new RuntimeException("누구십니까?");
        }
    }

    public List<TodoEntity> retrieve(final String userId) {
        return repository.findByUserId(userId);
    }

public List<TodoEntity> update(final TodoEntity entity) {
        // 새로운 게시글 저장을 통한 게시글 수정작업 전에 저장 엔티티가 맞는지 검증한다
    validate(entity);
    // entity id를 이용해 TodoEntity가져옴. optional은 비어있는 객체를 허용합니다
    final Optional<TodoEntity> original = repository.findById(entity.getId());
    // 업데이트 할 새로운 데이터가 존재하면 새 entity데이터로 덮어씌운다
    original.ifPresent(todo -> {
        todo.setTitle(entity.getTitle());
        todo.setDone(entity.isDone());
        // 덮어씌운 결과를 저장한다
        repository.save(todo);
    });
    // 저장된 결과를 조회한다
    return retrieve(entity.getUserId());
}

public List<TodoEntity> delete(final TodoEntity entity) {
    // 새로운 게시글 저장을 통한 게시글 삭제작업 전에 저장 엔티티가 맞는지 검증한다
    validate(entity);
    try {
        repository.delete(entity);
    }
    catch (Exception e) {
        // 우리는 게시글 삭제 실패를 왜 2번 말하는가??????
        // 하나는 자바 서버 로그에 기록을 남기고
        log.error("게시글 삭제 실패", entity.getId(), e);
        // 하나는 컨트롤러에 예외처리 메세지를 보낸다.
        throw new RuntimeException("게시글 삭제 에러" + entity.getId());
    }
    return retrieve(entity.getUserId());
}


}
