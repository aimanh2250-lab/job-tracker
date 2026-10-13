package com.aiman.jobtracker.controller; //handles the web part : reads token from browser after user login and sends answer + stat code

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String HelloController(){
        return "Hello";
    }
}