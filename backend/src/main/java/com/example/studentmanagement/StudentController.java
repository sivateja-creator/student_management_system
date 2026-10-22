package com.example.studentmanagement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository repository;

    // POST /api/students - add a student
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        if (student.getId() == null) {
            return ResponseEntity.badRequest().body("Student ID is required");
        }
        if (repository.existsById(student.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Student ID already exists");
        }
        Student saved = repository.save(student);
        return ResponseEntity.ok(saved);
    }

    // GET /api/students - get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // GET /api/students/{id} - get one student
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        return repository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found"));
    }

    // PUT /api/students/{id} - update a student
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        student.setId(id);
        Student updated = repository.save(student);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/students/{id} - delete a student
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        repository.deleteById(id);
        return ResponseEntity.ok("Student deleted");
    }
}