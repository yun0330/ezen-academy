package com.example.demo.persistence;

import com.example.demo.model.TodoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<TodoEntity, String> {
    List<TodoEntity> findByUserId(String userId);

    @Query("select t from TodoEntity t where t.userId = ?1")
    TodoEntity findByUserIdQuery(String userId);
}
// select t = TodoEntity 클래스의 객체를 반환(데이터 항목들)
// from TodoEntity t = TodoEntity 클래스에서 테이블 선택
// where t.userId = ?1 = TodoEntity의 userId 값이 일치하는 첫째 요소 반환


