package com.carbontrack.repository;

import com.carbontrack.entity.Badge;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    List<Badge> findByUser(User user);

    Optional<Badge> findByUserAndName(User user, String name);
}