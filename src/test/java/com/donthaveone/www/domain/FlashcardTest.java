package com.donthaveone.www.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.donthaveone.www.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FlashcardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Flashcard.class);
        Flashcard flashcard1 = new Flashcard();
        flashcard1.setId(1L);
        Flashcard flashcard2 = new Flashcard();
        flashcard2.setId(flashcard1.getId());
        assertThat(flashcard1).isEqualTo(flashcard2);
        flashcard2.setId(2L);
        assertThat(flashcard1).isNotEqualTo(flashcard2);
        flashcard1.setId(null);
        assertThat(flashcard1).isNotEqualTo(flashcard2);
    }
}
