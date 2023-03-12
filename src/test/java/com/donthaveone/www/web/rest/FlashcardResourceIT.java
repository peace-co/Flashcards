package com.donthaveone.www.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.donthaveone.www.IntegrationTest;
import com.donthaveone.www.domain.Flashcard;
import com.donthaveone.www.repository.FlashcardRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FlashcardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FlashcardResourceIT {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final String DEFAULT_HINT = "AAAAAAAAAA";
    private static final String UPDATED_HINT = "BBBBBBBBBB";

    private static final Integer DEFAULT_GLOBAL_RATING = 1;
    private static final Integer UPDATED_GLOBAL_RATING = 2;

    private static final String ENTITY_API_URL = "/api/flashcards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFlashcardMockMvc;

    private Flashcard flashcard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Flashcard createEntity(EntityManager em) {
        Flashcard flashcard = new Flashcard()
            .question(DEFAULT_QUESTION)
            .answer(DEFAULT_ANSWER)
            .hint(DEFAULT_HINT)
            .globalRating(DEFAULT_GLOBAL_RATING);
        return flashcard;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Flashcard createUpdatedEntity(EntityManager em) {
        Flashcard flashcard = new Flashcard()
            .question(UPDATED_QUESTION)
            .answer(UPDATED_ANSWER)
            .hint(UPDATED_HINT)
            .globalRating(UPDATED_GLOBAL_RATING);
        return flashcard;
    }

    @BeforeEach
    public void initTest() {
        flashcard = createEntity(em);
    }

    @Test
    @Transactional
    void createFlashcard() throws Exception {
        int databaseSizeBeforeCreate = flashcardRepository.findAll().size();
        // Create the Flashcard
        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashcard)))
            .andExpect(status().isCreated());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeCreate + 1);
        Flashcard testFlashcard = flashcardList.get(flashcardList.size() - 1);
        assertThat(testFlashcard.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testFlashcard.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testFlashcard.getHint()).isEqualTo(DEFAULT_HINT);
        assertThat(testFlashcard.getGlobalRating()).isEqualTo(DEFAULT_GLOBAL_RATING);
    }

    @Test
    @Transactional
    void createFlashcardWithExistingId() throws Exception {
        // Create the Flashcard with an existing ID
        flashcard.setId(1L);

        int databaseSizeBeforeCreate = flashcardRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashcard)))
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuestionIsRequired() throws Exception {
        int databaseSizeBeforeTest = flashcardRepository.findAll().size();
        // set the field null
        flashcard.setQuestion(null);

        // Create the Flashcard, which fails.

        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashcard)))
            .andExpect(status().isBadRequest());

        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAnswerIsRequired() throws Exception {
        int databaseSizeBeforeTest = flashcardRepository.findAll().size();
        // set the field null
        flashcard.setAnswer(null);

        // Create the Flashcard, which fails.

        restFlashcardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashcard)))
            .andExpect(status().isBadRequest());

        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFlashcards() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        // Get all the flashcardList
        restFlashcardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(flashcard.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION)))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER)))
            .andExpect(jsonPath("$.[*].hint").value(hasItem(DEFAULT_HINT)))
            .andExpect(jsonPath("$.[*].globalRating").value(hasItem(DEFAULT_GLOBAL_RATING)));
    }

    @Test
    @Transactional
    void getFlashcard() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        // Get the flashcard
        restFlashcardMockMvc
            .perform(get(ENTITY_API_URL_ID, flashcard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(flashcard.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER))
            .andExpect(jsonPath("$.hint").value(DEFAULT_HINT))
            .andExpect(jsonPath("$.globalRating").value(DEFAULT_GLOBAL_RATING));
    }

    @Test
    @Transactional
    void getNonExistingFlashcard() throws Exception {
        // Get the flashcard
        restFlashcardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFlashcard() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();

        // Update the flashcard
        Flashcard updatedFlashcard = flashcardRepository.findById(flashcard.getId()).get();
        // Disconnect from session so that the updates on updatedFlashcard are not directly saved in db
        em.detach(updatedFlashcard);
        updatedFlashcard.question(UPDATED_QUESTION).answer(UPDATED_ANSWER).hint(UPDATED_HINT).globalRating(UPDATED_GLOBAL_RATING);

        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFlashcard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFlashcard))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
        Flashcard testFlashcard = flashcardList.get(flashcardList.size() - 1);
        assertThat(testFlashcard.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testFlashcard.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFlashcard.getHint()).isEqualTo(UPDATED_HINT);
        assertThat(testFlashcard.getGlobalRating()).isEqualTo(UPDATED_GLOBAL_RATING);
    }

    @Test
    @Transactional
    void putNonExistingFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, flashcard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(flashcard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(flashcard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashcard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFlashcardWithPatch() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();

        // Update the flashcard using partial update
        Flashcard partialUpdatedFlashcard = new Flashcard();
        partialUpdatedFlashcard.setId(flashcard.getId());

        partialUpdatedFlashcard.answer(UPDATED_ANSWER).globalRating(UPDATED_GLOBAL_RATING);

        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashcard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFlashcard))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
        Flashcard testFlashcard = flashcardList.get(flashcardList.size() - 1);
        assertThat(testFlashcard.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testFlashcard.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFlashcard.getHint()).isEqualTo(DEFAULT_HINT);
        assertThat(testFlashcard.getGlobalRating()).isEqualTo(UPDATED_GLOBAL_RATING);
    }

    @Test
    @Transactional
    void fullUpdateFlashcardWithPatch() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();

        // Update the flashcard using partial update
        Flashcard partialUpdatedFlashcard = new Flashcard();
        partialUpdatedFlashcard.setId(flashcard.getId());

        partialUpdatedFlashcard.question(UPDATED_QUESTION).answer(UPDATED_ANSWER).hint(UPDATED_HINT).globalRating(UPDATED_GLOBAL_RATING);

        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashcard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFlashcard))
            )
            .andExpect(status().isOk());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
        Flashcard testFlashcard = flashcardList.get(flashcardList.size() - 1);
        assertThat(testFlashcard.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testFlashcard.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFlashcard.getHint()).isEqualTo(UPDATED_HINT);
        assertThat(testFlashcard.getGlobalRating()).isEqualTo(UPDATED_GLOBAL_RATING);
    }

    @Test
    @Transactional
    void patchNonExistingFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, flashcard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(flashcard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(flashcard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFlashcard() throws Exception {
        int databaseSizeBeforeUpdate = flashcardRepository.findAll().size();
        flashcard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashcardMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(flashcard))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Flashcard in the database
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFlashcard() throws Exception {
        // Initialize the database
        flashcardRepository.saveAndFlush(flashcard);

        int databaseSizeBeforeDelete = flashcardRepository.findAll().size();

        // Delete the flashcard
        restFlashcardMockMvc
            .perform(delete(ENTITY_API_URL_ID, flashcard.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Flashcard> flashcardList = flashcardRepository.findAll();
        assertThat(flashcardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
