package com.triviador.game_service;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/game")
public class GameController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Triviador!";
    }
}
