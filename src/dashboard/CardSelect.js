import React from "react";
import { ButtonStrip, Button } from "@dhis2/ui";
import "./DashboardStyle.css";

function CardSelect({ settings, saveSettings }) {
  const buttons = settings.cardOrder;

  function toggle(card) {
    settings.activeCards[card] = !settings.activeCards[card];
    saveSettings(settings);
  }

  return (
    <ButtonStrip className={"inner-selection-button"}>
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
  );
}

export default CardSelect;
