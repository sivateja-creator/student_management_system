package com.example.studentmanagement;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Student {

    @Id
    private Long id;
    private String name;
    private String email;
    private String department;
    private int marks;

    // No-argument constructor (required by JPA)
    public Student() {
    }

    // Parameterized constructor
    public Student(Long id, String name, String email, String department, int marks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.marks = marks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    // Grade is calculated from marks (not stored in the database)
    public String getGrade() {
        if (marks >= 80) {
            return "A";
        } else if (marks >= 60) {
            return "B";
        } else if (marks >= 40) {
            return "C";
        } else {
            return "F";
        }
    }
}