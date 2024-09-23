package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResponseDTO<T> {
    // 이 클래스는 제레릭 타입 T를 사용하였다.
    // 이는 다양한 데이터타입을 허용하는 의미로 error필드와 data필드로 구성
    // error필드는 에러메세지를 담고 data 필드는 실제응답 데이터를 담는다
    // 응답을 별도의 dto파일로 분리하여 관리 한다면 다양한 엔티티에 대해
    // 동일한 구조의 응답을 제공할 수 있어 코드의 일관성에 도움됨
    private String error;
    private List<T> data;
}
