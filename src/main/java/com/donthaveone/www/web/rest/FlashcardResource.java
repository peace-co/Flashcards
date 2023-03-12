package com.donthaveone.www.web.rest;

import com.donthaveone.www.domain.Flashcard;
import com.donthaveone.www.repository.FlashcardRepository;
import com.donthaveone.www.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.donthaveone.www.domain.Flashcard}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FlashcardResource {

    private final Logger log = LoggerFactory.getLogger(FlashcardResource.class);

    private static final String ENTITY_NAME = "flashcard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FlashcardRepository flashcardRepository;

    public FlashcardResource(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }

    /**
     * {@code POST  /flashcards} : Create a new flashcard.
     *
     * @param flashcard the flashcard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new flashcard, or with status {@code 400 (Bad Request)} if the flashcard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/flashcards")
    public ResponseEntity<Flashcard> createFlashcard(@Valid @RequestBody Flashcard flashcard) throws URISyntaxException {
        log.debug("REST request to save Flashcard : {}", flashcard);
        if (flashcard.getId() != null) {
            throw new BadRequestAlertException("A new flashcard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Flashcard result = flashcardRepository.save(flashcard);
        return ResponseEntity
            .created(new URI("/api/flashcards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /flashcards/:id} : Updates an existing flashcard.
     *
     * @param id the id of the flashcard to save.
     * @param flashcard the flashcard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashcard,
     * or with status {@code 400 (Bad Request)} if the flashcard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the flashcard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/flashcards/{id}")
    public ResponseEntity<Flashcard> updateFlashcard(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Flashcard flashcard
    ) throws URISyntaxException {
        log.debug("REST request to update Flashcard : {}, {}", id, flashcard);
        if (flashcard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashcard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashcardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Flashcard result = flashcardRepository.save(flashcard);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, flashcard.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /flashcards/:id} : Partial updates given fields of an existing flashcard, field will ignore if it is null
     *
     * @param id the id of the flashcard to save.
     * @param flashcard the flashcard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashcard,
     * or with status {@code 400 (Bad Request)} if the flashcard is not valid,
     * or with status {@code 404 (Not Found)} if the flashcard is not found,
     * or with status {@code 500 (Internal Server Error)} if the flashcard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/flashcards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Flashcard> partialUpdateFlashcard(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Flashcard flashcard
    ) throws URISyntaxException {
        log.debug("REST request to partial update Flashcard partially : {}, {}", id, flashcard);
        if (flashcard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashcard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashcardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Flashcard> result = flashcardRepository
            .findById(flashcard.getId())
            .map(existingFlashcard -> {
                if (flashcard.getQuestion() != null) {
                    existingFlashcard.setQuestion(flashcard.getQuestion());
                }
                if (flashcard.getAnswer() != null) {
                    existingFlashcard.setAnswer(flashcard.getAnswer());
                }
                if (flashcard.getHint() != null) {
                    existingFlashcard.setHint(flashcard.getHint());
                }
                if (flashcard.getCorrect() != null) {
                    existingFlashcard.setCorrect(flashcard.getCorrect());
                }
                if (flashcard.getGlobalRating() != null) {
                    existingFlashcard.setGlobalRating(flashcard.getGlobalRating());
                }

                return existingFlashcard;
            })
            .map(flashcardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, flashcard.getId().toString())
        );
    }

    /**
     * {@code GET  /flashcards} : get all the flashcards.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of flashcards in body.
     */
    @GetMapping("/flashcards")
    public ResponseEntity<List<Flashcard>> getAllFlashcards(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Flashcards");
        Page<Flashcard> page;
        if (eagerload) {
            page = flashcardRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = flashcardRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /flashcards/:id} : get the "id" flashcard.
     *
     * @param id the id of the flashcard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the flashcard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/flashcards/{id}")
    public ResponseEntity<Flashcard> getFlashcard(@PathVariable Long id) {
        log.debug("REST request to get Flashcard : {}", id);
        Optional<Flashcard> flashcard = flashcardRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(flashcard);
    }

    /**
     * {@code DELETE  /flashcards/:id} : delete the "id" flashcard.
     *
     * @param id the id of the flashcard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/flashcards/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        log.debug("REST request to delete Flashcard : {}", id);
        flashcardRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
