"use client"
import {createContext, useContext} from 'react';

interface SidebarContext {
   collapsed: boolean;
   setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const SidebarContext = createContext<SidebarContext>({
   collapsed: false,
   setCollapsed: () => {},
});

export const useSidebarContext = () => {
   return useContext(SidebarContext);
};