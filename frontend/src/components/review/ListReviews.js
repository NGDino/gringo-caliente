import React, { Fragment } from 'react'

const ListReviews = ({ reviews }) => {
    return (
        <Fragment>
            <div className="reviews w-75">
                <h3 className="text-center"><strong>Other's Reviews:</strong></h3>
                <hr />
                {reviews && reviews.map((review) =>
                    <div className="review-card my-3 p-3" id="white-bg" key = {review._id}>
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(review.rating / 5 ) * 100}%`}}></div>
                        </div>
                        <p className="review_user">by {review.name}</p>
                        <p className="review_comment">{review.comment}</p>

                        <hr />
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default ListReviews
