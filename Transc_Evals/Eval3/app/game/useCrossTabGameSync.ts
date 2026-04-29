'use client'

import { useEffect, useRef } from 'react'
import actionTypes from '../components/chess_game/reducer/actionTypes'

const CHANNEL_NAME = 'ft-transcendence-chess-sync-v1'

type AppDispatch = (action: { type: string; payload?: unknown }) => void

type BroadcastPayload<TState> = {
  senderId: string
  state: TState
}

export function useCrossTabGameSync<TState>(appState: TState, dispatch: AppDispatch, enabled = true) {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const tabIdRef = useRef('')
  const skipNextBroadcastRef = useRef(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return
    }

    tabIdRef.current = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<BroadcastPayload<TState>>) => {
      const payload = event.data

      if (!payload || payload.senderId === tabIdRef.current) {
        return
      }

      skipNextBroadcastRef.current = true
      dispatch({
        type: actionTypes.NEW_GAME,
        payload: payload.state,
      })
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [dispatch, enabled])

  useEffect(() => {
    if (!enabled || !channelRef.current || !tabIdRef.current) {
      return
    }

    if (skipNextBroadcastRef.current) {
      skipNextBroadcastRef.current = false
      return
    }

    channelRef.current.postMessage({
      senderId: tabIdRef.current,
      state: appState,
    })
  }, [appState, enabled])
}
