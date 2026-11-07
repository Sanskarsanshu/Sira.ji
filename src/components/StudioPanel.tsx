import React, { useEffect, useState, useRef } from 'react';
import { IMAGES } from '../constants/assets';
import { useAtelier } from '../context/AtelierContext';
import { api } from '../services/api';

interface ChatItem {
  id: string;
  sender: 'client' | 'atelier';
  text: string;
}

export const StudioPanel: React.FC = () => {
  const { openBooking, activeSilhouette, setActiveSilhouette, activeDrapeScore, setActiveDrapeScore } = useAtelier();

  // Initial animation sequence state
  const [msg1Visible, setMsg1Visible] = useState(false);
  const [bubble1Visible, setBubble1Visible] = useState(false);
  const [ai1Visible, setAi1Visible] = useState(false);
  const [ai1Typing, setAi1Typing] = useState(false);
  const [ai1Text, setAi1Text] = useState('');

  const [bubble2Visible, setBubble2Visible] = useState(false);
  const [ai2Visible, setAi2Visible] = useState(false);
  const [ai2Typing, setAi2Typing] = useState(false);
  const [ai2Text, setAi2Text] = useState('');

  const [cdVisible, setCdVisible] = useState(false);
  const [trackWidth, setTrackWidth] = useState('84%');

  // Right column state
  const [suiteLabelVisible, setSuiteLabelVisible] = useState(false);
  const [figIn, setFigIn] = useState(false);

  // Interactive patron prompt state
  const [interactiveMessages, setInteractiveMessages] = useState<ChatItem[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const text1 =
    'Curating a handpicked Sera.ji silhouette with relaxed architectural drapes, natural raw textures, and quiet luxury. Every piece is handpicked, polished, and quietly elevated.';
  const text2 =
    'Refining the cut into a formal Sera.ji evening drape — sculpted shoulder lines, handpicked silk lapels, and hand-embroidered artisanal detailing. Crafted for lasting poise and Mediterranean grace.';

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typeText = async (
      fullText: string,
      setTyping: (v: boolean) => void,
      setText: (fn: (prev: string) => string) => void
    ) => {
      if (reduce) {
        setText(() => fullText);
        return;
      }
      setTyping(true);
      await wait(500);
      setTyping(false);
      let k = 0;
      return new Promise<void>((resolve) => {
        const step = () => {
          k += 2;
          setText(() => fullText.slice(0, k));
          if (k < fullText.length) {
            setTimeout(step, 14);
          } else {
            resolve();
          }
        };
        step();
      });
    };

    // Initial narrative chat
    const runChat = async () => {
      await wait(reduce ? 0 : 1200);

      setMsg1Visible(true);
      await wait(reduce ? 0 : 350);

      setBubble1Visible(true);
      await wait(reduce ? 0 : 350);

      setAi1Visible(true);
      await typeText(text1, setAi1Typing, setAi1Text);
      await wait(reduce ? 0 : 350);

      setBubble2Visible(true);
      await wait(reduce ? 0 : 350);

      setAi2Visible(true);
      await typeText(text2, setAi2Typing, setAi2Text);
      await wait(reduce ? 0 : 350);

      setCdVisible(true);
      setTrackWidth(`${activeDrapeScore}%`);
    };

    const runProd = async () => {
      await wait(reduce ? 0 : 1200);
      setSuiteLabelVisible(true);
      await wait(reduce ? 0 : 350);
      setFigIn(true);
    };

    runChat();
    runProd();
  }, []);

  // Handle custom interactive prompt submissions
  const handlePromptSubmit = async (promptText: string) => {
    if (!promptText.trim() || isProcessingPrompt) return;

    const patronMsg: ChatItem = {
      id: `p-${Date.now()}`,
      sender: 'client',
      text: promptText,
    };

    setInteractiveMessages((prev) => [...prev, patronMsg]);
    setCustomInput('');
    setIsProcessingPrompt(true);

    if (chatScrollRef.current) {
      setTimeout(() => {
        chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }

    try {
      const response = await api.queryAtelierAi(promptText);
      const aiReply: ChatItem = {
        id: `ai-${Date.now()}`,
        sender: 'atelier',
        text: response.reply,
      };

      setInteractiveMessages((prev) => [...prev, aiReply]);
      setActiveSilhouette(response.silhouette);
      setActiveDrapeScore(response.drapeScore);
      setTrackWidth(`${response.drapeScore}%`);
    } catch {
      // fallback
    } finally {
      setIsProcessingPrompt(false);
      if (chatScrollRef.current) {
        setTimeout(() => {
          chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
      }
    }
  };

  const promptPresets = [
    'Handpicked Riviera Lapel',
    'Bias-Cut Evening Charmeuse',
    'Sera.ji Washed Linen Trench',
  ];

  return (
    <div className="studio" id="studio">
      {/* LEFT: ATELIER CHAT */}
      <div className="chat" ref={chatScrollRef}>
        <div className={`chat-top msg ${msg1Visible ? 'show' : ''}`}>
          <span>Sera.ji Handpicked Atelier</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 1.5l3.5 3.5L3 8.5" />
          </svg>
        </div>

        {/* Initial dialogue 1 */}
        <div className={`bubble msg ${bubble1Visible ? 'show' : ''}`}>
          Tailor an effortless Sera.ji silhouette in pure Italian mulberry silk and washed Belgian linen.
        </div>

        <div className={`ai msg ${ai1Visible ? 'show' : ''}`}>
          <div className="ai-ic">
            <svg viewBox="0 0 40 40" fill="#2a1a12">
              <path d="M5 5h13v13H5zM22 22h13v13H22z" />
              <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
            </svg>
          </div>
          <div className="ai-t">
            <span className="ghost">{text1}</span>
            <span className="live">
              {ai1Typing ? (
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                ai1Text
              )}
            </span>
          </div>
        </div>

        {/* Initial dialogue 2 */}
        <div className={`bubble msg ${bubble2Visible ? 'show' : ''}`}>
          Push it further: more formal soirée, handpicked lapel.
        </div>

        <div className={`ai msg ${ai2Visible ? 'show' : ''}`}>
          <div className="ai-ic">
            <svg viewBox="0 0 40 40" fill="#2a1a12">
              <path d="M5 5h13v13H5zM22 22h13v13H22z" />
              <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
            </svg>
          </div>
          <div className="ai-t">
            <span className="ghost">{text2}</span>
            <span className="live">
              {ai2Typing ? (
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                ai2Text
              )}
            </span>
          </div>
        </div>

        {/* Dynamically added interactive dialogue */}
        {interactiveMessages.map((msg) =>
          msg.sender === 'client' ? (
            <div key={msg.id} className="bubble msg show">
              {msg.text}
            </div>
          ) : (
            <div key={msg.id} className="ai msg show">
              <div className="ai-ic">
                <svg viewBox="0 0 40 40" fill="#2a1a12">
                  <path d="M5 5h13v13H5zM22 22h13v13H22z" />
                  <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
                </svg>
              </div>
              <div className="ai-t">
                <span className="live">{msg.text}</span>
              </div>
            </div>
          )
        )}

        {isProcessingPrompt && (
          <div className="ai msg show">
            <div className="ai-ic">
              <svg viewBox="0 0 40 40" fill="#2a1a12">
                <path d="M5 5h13v13H5zM22 22h13v13H22z" />
                <path d="M22 5a13 13 0 0 1 13 13H22zM18 35A13 13 0 0 1 5 22h13z" />
              </svg>
            </div>
            <div className="ai-t">
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        )}

        {/* ATELIER SPECIFICATION CARD */}
        <div className={`cd msg ${cdVisible ? 'show' : ''}`}>
          <div>
            <small>SERA.JI CLOTHING SPECIFICATION</small>
            <strong>{activeSilhouette}</strong>
          </div>
          <div className="slider">
            <small>Handpicked precision &amp; poise ({activeDrapeScore}%)</small>
            <div className="track">
              <b id="hero-track" style={{ width: trackWidth }} />
            </div>
          </div>
          <button
            className="cd-fitting-btn"
            type="button"
            onClick={() => openBooking('runway-fitting')}
            title="Order This Cut Now"
          >
            Order Now
          </button>
        </div>

        {/* INTERACTIVE PROMPT BAR */}
        <div className="chat-prompt-box">
          <div className="prompt-presets">
            {promptPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="chip-btn"
                onClick={() => handlePromptSubmit(preset)}
                disabled={isProcessingPrompt}
              >
                + {preset}
              </button>
            ))}
          </div>

          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handlePromptSubmit(customInput);
            }}
          >
            <input
              type="text"
              placeholder="Direct request to Sera.ji Master Draper (every piece is handpicked)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isProcessingPrompt}
            />
            <button type="submit" disabled={isProcessingPrompt || !customInput.trim()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: LOOKBOOK OUTPUT SUITE */}
      <div className="prod">
        <span className={`msg ${suiteLabelVisible ? 'show' : ''}`}>Sera.ji Lookbook Suite</span>
        <figure id="hero-fig" className={`msg ${figIn ? 'show in' : ''}`}>
          <img src={IMAGES.hat} alt="Sera.ji handpicked resort collection woven piece in golden light" />
        </figure>
      </div>
    </div>
  );
};
