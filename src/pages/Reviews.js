import React, { useState } from "react";
import styled from "styled-components";
import { Star, MessageSquarePlus } from "lucide-react";
import { useReviews } from "../context/ReviewContext";

const Page = styled.section`
  background: #f8fafc;
  min-height: 100vh;
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  h1 {
    font-size: 2.2rem;
    font-weight: 900;
    color: #153d2b;
    margin-bottom: 8px;
  }
  p {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;
  align-items: start;
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 0.8rem;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  input, textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid #cbd5e1;
    font-size: 0.9rem;
    font-weight: 600;
    outline: none;
    transition: all 0.2s;
    background: #fafafa;
    &:focus {
      border-color: #16a34a;
      background: white;
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
    }
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${props => props.$filled ? "#fbbf24" : "#cbd5e1"};
  transition: transform 0.1s;
  &:hover {
    transform: scale(1.15);
  }
`;

const SubmitButton = styled.button`
  background: #153d2b;
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    background: #166534;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 101, 52, 0.15);
  }
  &:active {
    transform: translateY(0);
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewCard = styled(Card)`
  padding: 24px;
  border-left: 4px solid #16a34a;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthorName = styled.p`
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
`;

const ReviewText = styled.p`
  font-size: 0.88rem;
  font-weight: 600;
  color: #475569;
  line-height: 1.6;
`;
const StickyCard = styled(Card)`
  position: sticky;
  top: 110px;
  @media (max-width: 860px) {
    position: relative;
    top: 0;
  }
`;

export default function Reviews() {
  const { approvedReviews, submitReview } = useReviews();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    submitReview({
      author: name,
      rating,
      text
    });
    setName("");
    setRating(5);
    setText("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <Page>
      <Header>
        <h1>Customer Reviews</h1>
        <p>Read what our community has to say or submit your own review!</p>
      </Header>

      <Layout>
        {/* Left column: Submit review */}
        <StickyCard>
          <Form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <MessageSquarePlus size={20} className="text-emerald-700" />
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide">Write a Review</h3>
            </div>

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl">
                ✓ Thank you! Your review has been submitted for moderation.
              </div>
            )}

            <FormGroup>
              <label>Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label>Rating</label>
              <StarRating>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarBtn
                    key={star}
                    type="button"
                    $filled={star <= rating}
                    onClick={() => setRating(star)}
                  >
                    <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
                  </StarBtn>
                ))}
              </StarRating>
            </FormGroup>

            <FormGroup>
              <label>Review Description</label>
              <textarea
                rows="4"
                placeholder="Tell us about your experience..."
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </FormGroup>

            <SubmitButton type="submit">Submit Review</SubmitButton>
          </Form>
        </StickyCard>

        {/* Right column: Reviews display */}
        <ReviewsList>
          {approvedReviews.length > 0 ? (
            approvedReviews.map((rev) => (
              <ReviewCard key={rev.id}>
                <ReviewHeader>
                  <div>
                    <AuthorName>{rev.author}</AuthorName>
                    <span className="text-[10px] text-stone-400 font-bold">Verified Customer</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </ReviewHeader>
                <ReviewText>"{rev.text}"</ReviewText>
              </ReviewCard>
            ))
          ) : (
            <div className="text-center py-10 bg-white border border-stone-200 rounded-3xl">
              <p className="text-sm font-bold text-stone-500">No approved reviews yet. Be the first to write one!</p>
            </div>
          )}
        </ReviewsList>
      </Layout>
    </Page>
  );
}
