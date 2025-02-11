import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import axios from "axios";
import { fetchMoreRecipes } from "../../Redux/Actions/recipeSwiperActions";
import {
  nextRecipe,
  clearRecipes,
  addSeenRecipe,
  setFilters,
  addAction,
  undoLastAction,
  resetState,
} from "../../Redux/Reducers/recipeSwiperSlice";
import RecipeSwiperFilters from "../../Components/RecipeSwiperFilters/RecipeSwiperFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import "./RecipeSwiper.css";

const RecipeSwiper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const {
    recipes,
    currentIndex,
    loading,
    error,
    noMoreRecipes,
    seenRecipeIds,
    filters,
    actionHistory,
  } = useSelector((state: RootState) => state.recipeSwiper);

  const currentRecipe = recipes[currentIndex];
  const placeholderImageUrl = "/placeholder-food.png";

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && (Array.isArray(value) ? value.length > 0 : true)
  );

  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Different thresholds for mobile and desktop
  const isDesktop = window.innerWidth > 768;
  const SWIPE_THRESHOLD = window.innerWidth > 768 ? 150 : 80;
  const MAX_SWIPE = SWIPE_THRESHOLD * 2;

  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (!isAnimating && !isFetchingMore) {
        setIsDragging(true);
        // Only update x movement, keep y at 0
        setDragDelta({ x: event.deltaX, y: 0 });
      }
    },
    onSwipedLeft: () => {
      if (Math.abs(dragDelta.x) > SWIPE_THRESHOLD && !isFetchingMore) {
        setSwipeDirection("left");
        handleSwipe(false, dragDelta.x);
      }
    },
    onSwipedRight: () => {
      if (Math.abs(dragDelta.x) > SWIPE_THRESHOLD && !isFetchingMore) {
        setSwipeDirection("right");
        handleSwipe(true, dragDelta.x);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      if (!isAnimating) {
        if (Math.abs(dragDelta.x) <= SWIPE_THRESHOLD) {
          setIsDragging(false);
          setDragDelta({ x: 0, y: 0 });
        }
      }
    },
    trackMouse: true,
    touchEventOptions: { passive: false },
  });

  useEffect(() => {
    let mounted = true;

    const initializeRecipes = async () => {
      if (mounted) {
        dispatch(clearRecipes());
        await dispatch(fetchMoreRecipes());
      }
    };

    initializeRecipes();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    const stateChange = {
      recipesLength: recipes.length,
      currentIndex,
      seenRecipeIds,
      cause:
        seenRecipeIds.length > 0
          ? `Recipe ${seenRecipeIds[seenRecipeIds.length - 1]} added to seen`
          : "Initial state",
    };

    console.log("State update:", stateChange);
  }, [currentIndex, seenRecipeIds.length]);

  const handleSwipe = async (liked: boolean, currentX?: number) => {
    if (currentRecipe) {
      setIsAnimating(true);

      const finalX =
        currentX || (liked ? SWIPE_THRESHOLD * 1.5 : -SWIPE_THRESHOLD * 1.5);
      setDragDelta({
        x: finalX,
        y: 0,
      });

      dispatch(addSeenRecipe(currentRecipe.id));
      dispatch(
        addAction({
          type: liked ? "like" : "dislike",
          recipeId: currentRecipe.id,
          recipeIndex: currentIndex,
        })
      );

      if (liked) {
        await likeRecipe(currentRecipe.id);
      }

      const needMoreRecipes =
        currentIndex >= recipes.length - 3 && !noMoreRecipes;
      if (needMoreRecipes) {
        setIsFetchingMore(true);
        await dispatch(fetchMoreRecipes());
        setIsFetchingMore(false);
      }

      // Reset states after animation
      setTimeout(() => {
        dispatch(nextRecipe());
        setIsAnimating(false);
        setSwipeDirection(null);
        setDragDelta({ x: 0, y: 0 });
        setIsDragging(false);
      }, 500);
    }
  };

  const unlikeRecipe = async (recipeId: number) => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/unlikeRecipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recipe unliked:", recipeId);
    } catch (error) {
      console.error("Error unliking the recipe:", error);
    }
  };

  const handleClearFilters = () => {
    dispatch(resetState());
    dispatch(setFilters({}));
    dispatch(fetchMoreRecipes());
  };

  const handleUndo = async () => {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory[actionHistory.length - 1];

    // If the last action was a like, unlike the recipe
    if (lastAction.type === "like") {
      await unlikeRecipe(lastAction.recipeId);
    }

    dispatch(undoLastAction());
  };

  const getSwipeOpacity = (deltaX: number) => {
    const absoluteDelta = Math.abs(deltaX);
    return Math.min(absoluteDelta / MAX_SWIPE, 0.3);
  };

  const getSwipeState = (deltaX: number) => {
    if (deltaX > SWIPE_THRESHOLD) return "show-like";
    if (deltaX < -SWIPE_THRESHOLD) return "show-dislike";
    return "";
  };

  const handleButtonSwipe = (isLike: boolean) => {
    if (!isFetchingMore) {
      setSwipeDirection(isLike ? "right" : "left");
      handleSwipe(isLike);
    }
  };
  const likeRecipe = async (recipeId: number) => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/likeRecipe/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recipe liked:", recipeId);
    } catch (error) {
      console.error("Error liking the recipe:", error);
    }
  };

  const openRecipeInNewTab = (recipeId: number) => {
    const url = `/recipe/${recipeId}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <RecipeSwiperFilters />
        <div className="flex justify-center items-center mt-8">
          <p>Ladataan reseptejä...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (
    (noMoreRecipes && currentIndex >= recipes.length) ||
    (!currentRecipe && !loading)
  ) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <RecipeSwiperFilters />
        {hasActiveFilters ? (
          <div className="text-center mt-8">
            <p className="text-xl text-gray-700 mb-4">
              Valituilla suodattimilla ei löytynyt reseptejä.
            </p>
            <p className="text-gray-600 mb-4">
              Kokeile muuttaa suodattimia tai tyhjennä ne kokonaan.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-xl text-gray-700 mb-4">
              Ei enempää reseptejä saatavilla.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Kokeile uudelleen
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!currentRecipe) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <RecipeSwiperFilters />
      {currentRecipe && (
        <div
          {...handlers}
          className={`w-full max-w-md relative mt-8 recipe-card ${
            swipeDirection ? `swipe-${swipeDirection}` : ""
          } ${isDragging ? "dragging" : ""} ${getSwipeState(dragDelta.x)}`}
          style={{
            transform: isDragging
              ? `translate(${dragDelta.x}px, 0px) rotate(${
                  dragDelta.x * 0.1
                }deg)`
              : undefined,
            zIndex: isAnimating ? 1 : 0,
          }}
          onAnimationEnd={() => {
            setSwipeDirection(null);
            setDragDelta({ x: 0, y: 0 });
            setIsAnimating(false);
          }}
        >
          {isDesktop && !swipeDirection && (
            <>
              <div className="swipe-indicator like-indicator">TYKKÄÄ</div>
              <div className="swipe-indicator dislike-indicator">OHITA</div>
            </>
          )}
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{
              backgroundColor:
                dragDelta.x > 0
                  ? `rgba(34, 197, 94, ${getSwipeOpacity(dragDelta.x)})`
                  : `rgba(239, 68, 68, ${getSwipeOpacity(dragDelta.x)})`,
            }}
          >
            <div className="flex justify-center mb-4">
              <button
                onClick={() => openRecipeInNewTab(currentRecipe.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                Avaa
              </button>
            </div>
            <img
              src={
                currentRecipe.picture_url
                  ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${currentRecipe.picture_url}`
                  : placeholderImageUrl
              }
              alt={currentRecipe.title}
              className="w-full h-48 object-contain rounded-lg mb-4 select-none pointer-events-none"
              draggable="false"
            />
            <h2 className="text-xl font-bold mb-4">{currentRecipe.title}</h2>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <span className="font-medium">Kategoria:</span>{" "}
                {currentRecipe.category}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Pääraaka-aine:</span>{" "}
                {currentRecipe.main_ingredient}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentRecipe.secondary_categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4 px-4">
              <button
                onClick={() => handleButtonSwipe(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-full"
              >
                Ohita
              </button>
              <button
                onClick={handleUndo}
                disabled={actionHistory.length === 0}
                className={`px-4 py-2 rounded-full ${
                  actionHistory.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
              >
                Kumoa edellinen
              </button>
              <button
                onClick={() => handleButtonSwipe(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-full"
              >
                Tykkää
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSwiper;
