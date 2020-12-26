import React from "react";

export default function TestAccount() {
  return (
    <div className="TestAccount-Home">
      <div>Welcome to the demo test account.</div>
      <p>
        There are four books that are already added to the library and wishlist
        so that you may see what they look like with books added.
      </p>
      <p>
        You may remove them from the lists by simply pressing the red x button.
      </p>
      <p>
        The ISBN-13's for the four books are listed here if you would like to
        try using them to see the app in action.
      </p>
      <ul>
        <li>9781423134947 - Percy Jackson</li>
        <li>9780679720225 - The Fall</li>
        <li>9781781100233 - Prisoner of Azkaban</li>
        <li>9781781100219 - Phlosopher's Stone</li>
      </ul>
    </div>
  );
}
