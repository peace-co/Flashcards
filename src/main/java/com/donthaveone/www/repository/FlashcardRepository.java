package com.donthaveone.www.repository;

import com.donthaveone.www.domain.Flashcard;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Flashcard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {}
