package com.donthaveone.www.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Flashcard.
 */
@Entity
@Table(name = "flashcard")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Flashcard implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "question", nullable = false)
    private String question;

    @NotNull
    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "hint")
    private String hint;

    @Column(name = "correct")
    private Boolean correct;

    @Column(name = "global_rating")
    private Integer globalRating;

    @ManyToMany
    @JoinTable(
        name = "rel_flashcard__tag",
        joinColumns = @JoinColumn(name = "flashcard_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "flashcards" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Flashcard id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return this.question;
    }

    public Flashcard question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return this.answer;
    }

    public Flashcard answer(String answer) {
        this.setAnswer(answer);
        return this;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getHint() {
        return this.hint;
    }

    public Flashcard hint(String hint) {
        this.setHint(hint);
        return this;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public Boolean getCorrect() {
        return this.correct;
    }

    public Flashcard correct(Boolean correct) {
        this.setCorrect(correct);
        return this;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public Integer getGlobalRating() {
        return this.globalRating;
    }

    public Flashcard globalRating(Integer globalRating) {
        this.setGlobalRating(globalRating);
        return this;
    }

    public void setGlobalRating(Integer globalRating) {
        this.globalRating = globalRating;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Flashcard tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Flashcard addTag(Tag tag) {
        this.tags.add(tag);
        tag.getFlashcards().add(this);
        return this;
    }

    public Flashcard removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getFlashcards().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Flashcard)) {
            return false;
        }
        return id != null && id.equals(((Flashcard) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Flashcard{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", hint='" + getHint() + "'" +
            ", correct='" + getCorrect() + "'" +
            ", globalRating=" + getGlobalRating() +
            "}";
    }
}
