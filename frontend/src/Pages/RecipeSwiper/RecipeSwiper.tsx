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
  } = useSelector((state: RootState) => state.recipeSwiper);

  const currentRecipe = recipes[currentIndex];
  const placeholderImageUrl = "/placeholder-food.png";

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && (Array.isArray(value) ? value.length > 0 : true)
  );

  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Different thresholds for mobile and desktop
  const isDesktop = window.innerWidth > 768;
  const SWIPE_THRESHOLD = window.innerWidth > 768 ? 150 : 80;
  const MAX_SWIPE = SWIPE_THRESHOLD * 2; // Maximum swipe distance for full opacity

  const handlers = useSwipeable({
    onSwiping: (event) => {
      setIsDragging(true);
      setDragDelta({ x: event.deltaX, y: event.deltaY });
    },
    onSwipedLeft: () => {
      if (Math.abs(dragDelta.x) > SWIPE_THRESHOLD) {
        setIsAnimating(true);
        setSwipeDirection("left");
        setTimeout(() => {
          handleSwipe(false);
        }, 500);
      }
    },
    onSwipedRight: () => {
      if (Math.abs(dragDelta.x) > SWIPE_THRESHOLD) {
        setIsAnimating(true);
        setSwipeDirection("right");
        setTimeout(() => {
          handleSwipe(true);
        }, 500);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      if (!isAnimating) {
        setIsDragging(false);
        setDragDelta({ x: 0, y: 0 });
      }
    },
    trackMouse: true,
    touchEventOptions: { passive: false },
  });

  useEffect(() => {
    console.log("Component mounted - clearing and refetching recipes");
    dispatch(clearRecipes());
    dispatch(fetchMoreRecipes());
  }, []);

  useEffect(() => {
    if (recipes.length === 0 && !noMoreRecipes) {
      dispatch(fetchMoreRecipes());
    }
  }, [dispatch, recipes.length, noMoreRecipes]);

  useEffect(() => {
    console.log("Current state:", {
      recipesLength: recipes.length,
      currentIndex,
      seenRecipeIds,
    });
  }, [recipes.length, currentIndex, seenRecipeIds]);

  const handleSwipe = (liked: boolean) => {
    if (currentRecipe) {
      console.log("Adding recipe to seen:", currentRecipe.id);
      dispatch(addSeenRecipe(currentRecipe.id));

      if (liked) {
        likeRecipe(currentRecipe.id);
      }

      if (currentIndex >= recipes.length - 1 && !noMoreRecipes) {
        console.log("Last recipe in batch, checking for more");
        dispatch(fetchMoreRecipes());
      } else {
        dispatch(nextRecipe());
      }
    }
  };

  const getSwipeOpacity = (deltaX: number) => {
    const absoluteDelta = Math.abs(deltaX);
    return Math.min(absoluteDelta / MAX_SWIPE, 0.3); // Max opacity of 0.3
  };

  const getSwipeState = (deltaX: number) => {
    if (deltaX > SWIPE_THRESHOLD) return "show-like";
    if (deltaX < -SWIPE_THRESHOLD) return "show-dislike";
    return "";
  };

  const handleButtonSwipe = (isLike: boolean) => {
    setIsAnimating(true);
    setDragDelta({
      x: isLike ? SWIPE_THRESHOLD * 1.5 : -SWIPE_THRESHOLD * 1.5,
      y: 0,
    });
    setSwipeDirection(isLike ? "right" : "left");

    setTimeout(() => {
      if (isLike && currentRecipe) {
        likeRecipe(currentRecipe.id);
      }
      handleSwipe(isLike);
      // Reset states after the swipe
      setDragDelta({ x: 0, y: 0 });
    }, 500);
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

  if (noMoreRecipes || (!currentRecipe && !loading)) {
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
              onClick={() => {
                dispatch(setFilters({}));
                dispatch(clearRecipes());
                dispatch(fetchMoreRecipes());
              }}
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
              onClick={() => {
                dispatch(setFilters({}));
                dispatch(clearRecipes());
                dispatch(fetchMoreRecipes());
              }}
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
              ? `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${
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
