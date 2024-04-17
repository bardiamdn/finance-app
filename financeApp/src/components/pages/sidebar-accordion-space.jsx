import React from "react";

//components
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function SidebarAccordionSpace() {

    return (
        <>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Spaces
                    </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                    Comming Soon ...
                    </AccordionContent>
                </AccordionItem>
        </>
    )

}