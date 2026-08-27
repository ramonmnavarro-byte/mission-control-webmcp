'use client'
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createDemoStore, type DemoStore } from './demo-store'
import { registerMissionControlTools, type ModelContext } from './webmcp'
import type { DemoAssignee, DemoSnapshot, IncidentAction, Priority } from './types'

declare global { interface Document { modelContext?:ModelContext } }
const Context=createContext<DemoStore|null>(null)
export function DemoProvider({children}:{children:ReactNode}){const[store]=useState(createDemoStore);useEffect(()=>{if(document.modelContext)return registerMissionControlTools(document.modelContext,store)},[store]);return <Context.Provider value={store}>{children}</Context.Provider>}
export function useDemo():{snapshot:DemoSnapshot;createTask(input:{title:string;priority:Priority;assignee:DemoAssignee}):void;runSecurityScan():void;advanceIncident(action:IncidentAction):void;webMcp:boolean}{const store=useContext(Context);if(!store)throw new Error('Missing DemoProvider');const snapshot=useSyncExternalStore(store.subscribe,store.getSnapshot,store.getSnapshot);return{snapshot,createTask:(input)=>{store.createTask(input)},runSecurityScan:()=>{store.runSecurityScan()},advanceIncident:(action)=>{store.advanceIncident({action,source:'human'})},webMcp:typeof document!=='undefined'&&Boolean(document.modelContext)}}
