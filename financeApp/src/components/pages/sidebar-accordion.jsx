import React, { useState } from "react";
import axios from "axios";

// components
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SidebarAccordionAccount } from "@/components/pages/sidebar-accordion-account"
import { SidebarAccordionSpace } from "@/components/pages/sidebar-accordion-space"


export function SidebarAccordion() {
    
    return(
        <Accordion type="single" collapsible className="w-full mt-5">
            <SidebarAccordionAccount />
            <SidebarAccordionSpace />
        </Accordion>
    )
}
  