"use client";



import { ChatInput } from "@/components/quote-assistant/ChatInput";

import { ChatMessage } from "@/components/quote-assistant/ChatMessage";

import { ChatSummary } from "@/components/quote-assistant/ChatSummary";

import { TypingIndicator } from "@/components/quote-assistant/TypingIndicator";

import { useFocusTrap } from "@/hooks/useFocusTrap";

import { useQuoteAssistant } from "@/hooks/useQuoteAssistant";

import { useIsMobile, useScrollDirection } from "@/hooks/useScrollDirection";

import { siteConfig } from "@/lib/site-config";

import { cn } from "@/lib/utils";

import { MessageCircle, Phone, RotateCcw, X } from "lucide-react";

import { useEffect, useId, useRef } from "react";



export function QuoteAssistantWidget() {

  const {

    isOpen,

    isTyping,

    isComplete,

    isSubmitting,

    initialized,

    messages,

    answers,

    currentStep,

    currentStepId,

    error,
    close,
    toggle,

    initialize,

    submitAnswer,

    submitQuote,

    reset,

  } = useQuoteAssistant();



  const messagesEndRef = useRef<HTMLDivElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const scrollVisible = useScrollDirection({

    alwaysVisible: isMobile,

    threshold: 10,

    topOffset: 80,

  });

  const panelId = useId();



  const isTriggerVisible = scrollVisible && !isOpen;



  useFocusTrap(panelRef, isOpen);



  useEffect(() => {

    if (isOpen && !initialized) {

      initialize();

    }

  }, [isOpen, initialized, initialize]);



  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, isTyping, currentStepId]);



  useEffect(() => {

    if (!isOpen) return;



    function handleEscape(e: KeyboardEvent) {

      if (e.key === "Escape") close();

    }



    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {

      document.body.style.overflow = "";

      document.removeEventListener("keydown", handleEscape);

    };

  }, [isOpen, close]);



  const showInput =

    !isTyping &&

    !isComplete &&

    currentStep.inputType !== "none" &&

    currentStepId !== "summary";



  const showSummary = currentStepId === "summary" && !isComplete;



  const handleInputSubmit = (value: unknown) => {

    submitAnswer(currentStep, value);

  };



  return (

    <>

      <button

        type="button"

        onClick={toggle}

        aria-label="Open quote assistant chat"

        aria-expanded={isOpen}

        aria-controls={isOpen ? panelId : undefined}

        aria-hidden={!isTriggerVisible}

        tabIndex={isTriggerVisible ? 0 : -1}

        className={cn(

          "fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.5rem)] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-surface-elevated text-white shadow-lg",

          "hover:border-accent/50 hover:text-accent",

          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",

          "transition-all duration-500 ease-out",

          isTriggerVisible

            ? "translate-y-0 opacity-100 pointer-events-auto"

            : "translate-y-6 opacity-0 pointer-events-none"

        )}

      >

        <MessageCircle className="h-5 w-5" aria-hidden="true" />

      </button>



      {isOpen && (

        <div

          id={panelId}

          className={cn(

            "fixed z-50 flex flex-col bg-background",

            "inset-0 sm:inset-auto sm:bottom-6 sm:right-6",

            "sm:h-[min(640px,calc(100vh-48px))] sm:w-[400px]",

            "sm:rounded-2xl sm:border sm:border-surface-border sm:shadow-2xl"

          )}

          role="dialog"

          aria-label="Quote assistant"

          aria-modal="true"

          ref={panelRef}

        >

          <div className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface px-4 py-3 sm:rounded-t-2xl">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xs font-black text-white">

                PP

              </div>

              <div>

                <p className="text-sm font-semibold text-white">Quote Assistant</p>

                <p className="text-xs text-white/40">{siteConfig.name}</p>

              </div>

            </div>

            <div className="flex items-center gap-1">

              {isComplete && (

                <button

                  type="button"

                  onClick={reset}

                  className="rounded-lg p-2 text-white/50 transition-colors hover:bg-surface-elevated hover:text-white"

                  aria-label="Start new quote"

                >

                  <RotateCcw className="h-4 w-4" />

                </button>

              )}

              <button

                type="button"

                onClick={close}

                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-surface-elevated hover:text-white"

                aria-label="Close quote assistant"

              >

                <X className="h-5 w-5" />

              </button>

            </div>

          </div>



          <div

            className="flex-1 overflow-y-auto px-4 py-4"

            aria-live="polite"

            aria-relevant="additions"

          >

            <div className="space-y-3">

              {messages.map((msg) => (

                <ChatMessage key={msg.id} message={msg} />

              ))}

              {isTyping && <TypingIndicator />}

            </div>



            {showSummary && (

              <div className="mt-4">

                <ChatSummary

                  answers={answers}

                  onSubmit={submitQuote}

                  isSubmitting={isSubmitting}

                  error={error}

                />

              </div>

            )}



            {isComplete && (

              <div className="mt-4 space-y-3">

                <a

                  href={siteConfig.contact.phoneHref}

                  className="flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-sm font-medium text-white transition-colors hover:border-accent/50"

                >

                  <Phone className="h-4 w-4 text-accent" aria-hidden="true" />

                  Call {siteConfig.contact.phone}

                </a>

              </div>

            )}



            <div ref={messagesEndRef} />

          </div>



          {(showInput || currentStep.hint) && (

            <div className="shrink-0 border-t border-surface-border bg-surface px-4 py-3 sm:rounded-b-2xl">

              {currentStep.hint && !isTyping && (

                <p className="mb-3 text-xs text-white/40">{currentStep.hint}</p>

              )}

              {showInput && (

                <ChatInput

                  step={currentStep}

                  onSubmit={handleInputSubmit}

                  disabled={isTyping || isSubmitting}

                />

              )}

            </div>

          )}

        </div>

      )}

    </>

  );

}


