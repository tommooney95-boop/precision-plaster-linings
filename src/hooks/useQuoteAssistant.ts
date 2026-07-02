"use client";



import {

  formatAnswerForDisplay,

  getFirstQuestionStepId,

  getNextStepId,

  getStep,

} from "@/lib/quote-assistant/flow";

import type {

  ChatMessage,

  FlowStep,

  QuoteAssistantAnswers,

} from "@/lib/quote-assistant/types";

import { useCallback, useReducer, useRef } from "react";



const TYPING_DELAY_MS = 600;



interface State {

  isOpen: boolean;

  messages: ChatMessage[];

  currentStepId: string;

  answers: QuoteAssistantAnswers;

  isTyping: boolean;

  isSubmitting: boolean;

  isComplete: boolean;

  error: string | null;

  initialized: boolean;

}



type Action =

  | { type: "OPEN" }

  | { type: "CLOSE" }

  | { type: "INIT" }

  | { type: "ADD_MESSAGE"; message: ChatMessage }

  | { type: "SET_TYPING"; isTyping: boolean }

  | { type: "SET_STEP"; stepId: string }

  | { type: "UPDATE_ANSWERS"; answers: QuoteAssistantAnswers }

  | { type: "SET_SUBMITTING"; isSubmitting: boolean }

  | { type: "SET_COMPLETE" }

  | { type: "SET_ERROR"; error: string | null }

  | { type: "RESET" };



const initialState: State = {

  isOpen: false,

  messages: [],

  currentStepId: "welcome",

  answers: {},

  isTyping: false,

  isSubmitting: false,

  isComplete: false,

  error: null,

  initialized: false,

};



function reducer(state: State, action: Action): State {

  switch (action.type) {

    case "OPEN":

      return { ...state, isOpen: true };

    case "CLOSE":

      return { ...state, isOpen: false };

    case "INIT":

      return { ...state, initialized: true };

    case "ADD_MESSAGE":

      return { ...state, messages: [...state.messages, action.message] };

    case "SET_TYPING":

      return { ...state, isTyping: action.isTyping };

    case "SET_STEP":

      return { ...state, currentStepId: action.stepId };

    case "UPDATE_ANSWERS":

      return { ...state, answers: action.answers };

    case "SET_SUBMITTING":

      return { ...state, isSubmitting: action.isSubmitting };

    case "SET_COMPLETE":

      return { ...state, isComplete: true, isSubmitting: false };

    case "SET_ERROR":

      return { ...state, error: action.error, isSubmitting: false };

    case "RESET":

      return { ...initialState, isOpen: state.isOpen };

    default:

      return state;

  }

}



function createMessage(role: ChatMessage["role"], content: string): ChatMessage {

  return {

    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

    role,

    content,

    timestamp: new Date(),

  };

}



function delay(ms: number) {

  return new Promise((resolve) => setTimeout(resolve, ms));

}



export function useQuoteAssistant() {

  const [state, dispatch] = useReducer(reducer, initialState);

  const answersRef = useRef(state.answers);

  answersRef.current = state.answers;



  const showAssistantMessage = useCallback(async (stepId: string) => {

    const step = getStep(stepId);

    dispatch({ type: "SET_TYPING", isTyping: true });

    await delay(TYPING_DELAY_MS);

    dispatch({

      type: "ADD_MESSAGE",

      message: createMessage("assistant", step.question),

    });

    dispatch({ type: "SET_STEP", stepId });

    dispatch({ type: "SET_TYPING", isTyping: false });

  }, []);



  const initialize = useCallback(async () => {

    if (state.initialized) return;

    dispatch({ type: "INIT" });

    await showAssistantMessage("welcome");

    await showAssistantMessage(getFirstQuestionStepId());

  }, [state.initialized, showAssistantMessage]);



  const open = useCallback(() => {

    dispatch({ type: "OPEN" });

  }, []);



  const close = useCallback(() => {

    dispatch({ type: "CLOSE" });

  }, []);



  const toggle = useCallback(() => {

    dispatch({ type: state.isOpen ? "CLOSE" : "OPEN" });

  }, [state.isOpen]);



  const submitAnswer = useCallback(

    async (step: FlowStep, value: unknown) => {

      const displayValue = formatAnswerForDisplay(step, value);

      dispatch({

        type: "ADD_MESSAGE",

        message: createMessage("user", displayValue),

      });



      const updatedAnswers: QuoteAssistantAnswers = { ...answersRef.current };

      if (step.answerKey) {

        (updatedAnswers as Record<string, unknown>)[step.answerKey] = value;

      }



      if (

        step.answerKey === "workType" &&

        ["Commercial Project", "Office Fit-out", "Suspended Ceiling"].includes(

          value as string

        )

      ) {

        updatedAnswers.propertyType = "Commercial";

      }



      answersRef.current = updatedAnswers;

      dispatch({ type: "UPDATE_ANSWERS", answers: updatedAnswers });



      const nextId = getNextStepId(step.id, updatedAnswers);

      if (nextId) {

        await showAssistantMessage(nextId);

      }

    },

    [showAssistantMessage]

  );



  const skipStep = useCallback(

    async (step: FlowStep) => {

      dispatch({

        type: "ADD_MESSAGE",

        message: createMessage("user", "Skipped"),

      });



      const nextId = getNextStepId(step.id, answersRef.current);

      if (nextId) {

        await showAssistantMessage(nextId);

      }

    },

    [showAssistantMessage]

  );



  const submitQuote = useCallback(async () => {

    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });

    dispatch({ type: "SET_ERROR", error: null });



    try {

      const formData = new FormData();

      formData.append("answers", JSON.stringify(answersRef.current));



      if (answersRef.current.photos) {

        for (const file of answersRef.current.photos) {

          formData.append("photos", file);

        }

      }



      const response = await fetch("/api/quote-assistant", {

        method: "POST",

        body: formData,

      });



      if (!response.ok) {

        const data = await response.json().catch(() => ({}));

        throw new Error(data.error ?? "Submission failed");

      }



      dispatch({ type: "SET_COMPLETE" });

      await showAssistantMessage("submitted");

    } catch (err) {

      dispatch({

        type: "SET_ERROR",

        error:

          err instanceof Error

            ? err.message

            : "Something went wrong. Please try again or call us directly.",

      });

    }

  }, [showAssistantMessage]);



  const reset = useCallback(() => {

    dispatch({ type: "RESET" });

  }, []);



  const currentStep = getStep(state.currentStepId);



  return {

    ...state,

    currentStep,

    open,

    close,

    toggle,

    initialize,

    submitAnswer,

    skipStep,

    submitQuote,

    reset,

  };

}



export type QuoteAssistantHook = ReturnType<typeof useQuoteAssistant>;


