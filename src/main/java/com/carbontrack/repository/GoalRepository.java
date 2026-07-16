package com.carbontrack.repository;

import com.carbontrack.entity.Goal;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUser(User user);

    Optional<Goal> findByUserAndStatus(User user, String status);

}