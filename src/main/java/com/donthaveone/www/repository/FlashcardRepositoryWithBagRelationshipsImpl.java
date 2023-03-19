package com.donthaveone.www.repository;

import com.donthaveone.www.domain.Flashcard;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class FlashcardRepositoryWithBagRelationshipsImpl implements FlashcardRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Flashcard> fetchBagRelationships(Optional<Flashcard> flashcard) {
        return flashcard.map(this::fetchTags);
    }

    @Override
    public Optional<List<Flashcard>> fetchBagRelationshipsByTags(Optional<List<Flashcard>> flashcards) {
        return flashcards.map(this::fetchTags);
    }

    @Override
    public Page<Flashcard> fetchBagRelationships(Page<Flashcard> flashcards) {
        return new PageImpl<>(fetchBagRelationships(flashcards.getContent()), flashcards.getPageable(), flashcards.getTotalElements());
    }

    @Override
    public List<Flashcard> fetchBagRelationships(List<Flashcard> flashcards) {
        return Optional.of(flashcards).map(this::fetchTags).orElse(Collections.emptyList());
    }

    Flashcard fetchTags(Flashcard result) {
        return entityManager
            .createQuery(
                "select flashcard from Flashcard flashcard left join fetch flashcard.tags where flashcard is :flashcard",
                Flashcard.class
            )
            .setParameter("flashcard", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Flashcard> fetchTags(List<Flashcard> flashcards) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, flashcards.size()).forEach(index -> order.put(flashcards.get(index).getId(), index));
        List<Flashcard> result = entityManager
            .createQuery(
                "select distinct flashcard from Flashcard flashcard left join fetch flashcard.tags where flashcard in :flashcards",
                Flashcard.class
            )
            .setParameter("flashcards", flashcards)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
