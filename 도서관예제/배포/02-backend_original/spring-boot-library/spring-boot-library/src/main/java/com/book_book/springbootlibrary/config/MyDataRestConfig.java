
package com.book_book.springbootlibrary.config;

import com.book_book.springbootlibrary.entity.Book;
import com.book_book.springbootlibrary.entity.Review;
import com.book_book.springbootlibrary.entity.Message;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    // CORS (Cross-Origin Resource Sharing)를 위해 허용할 오리진(출처)을 지정합니다.
    private String theAllowedOrigins = "http://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        // REST API 응답에서 엔티티 ID를 노출시킵니다.
        config.exposeIdsFor(Book.class);
        config.exposeIdsFor(Review.class);
        config.exposeIdsFor(Message.class);

        // CORS(Cross-Origin Resource Sharing) 매핑을 구성합니다.
        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins);
    }
}