package com.devtrackai.studysessions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    List<StudySession> findAllByUserIdOrderBySessionDateDesc(Long userId);

    Optional<StudySession> findByIdAndUserId(Long id, Long userId);

    /** Sum of minutes in a given date range for a user. */
    @Query("SELECT COALESCE(SUM(s.minutes), 0) FROM StudySession s " +
            "WHERE s.user.id = :userId AND s.sessionDate BETWEEN :from AND :to")
    int sumMinutesBetween(@Param("userId") Long userId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    /**
     * All distinct session dates for a user, sorted descending — used for streak
     * calc.
     */
    @Query("SELECT DISTINCT s.sessionDate FROM StudySession s " +
            "WHERE s.user.id = :userId ORDER BY s.sessionDate DESC")
    List<LocalDate> findDistinctSessionDatesByUserIdDesc(@Param("userId") Long userId);
}
