import React from "react";
import { ButtonStrip, Button } from "@dhis2/ui";

function CardSelect({ settings, saveSettings }) {
    const buttons = settings.cardOrder;

    function toggle(card) {
        settings.activeCards[card] = !settings.activeCards[card];
        saveSettings(settings);
    }

    return (
        <div>
            <ButtonStrip>
                {buttons.map((card) => {
                    return (
                        <Button
                            key={card}
                            primary={settings.activeCards[card]}
                            onClick={() => toggle(card)}
                        >
                            {card}
                        </Button>
                    );
                })}
            </ButtonStrip>
        </div>
    );
}

export default CardSelect;
