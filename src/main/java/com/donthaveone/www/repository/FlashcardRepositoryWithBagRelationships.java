package com.donthaveone.www.repository;

import com.donthaveone.www.domain.Flashcard;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface FlashcardRepositoryWithBagRelationships {
    Optional<Flashcard> fetchBagRelationships(Optional<Flashcard> flashcard);

    Optional<List<Flashcard>> fetchBagRelationshipsByTags(Optional<List<Flashcard>> flashcards);

    List<Flashcard> fetchBagRelationships(List<Flashcard> flashcards);

    Page<Flashcard> fetchBagRelationships(Page<Flashcard> flashcards);
}
