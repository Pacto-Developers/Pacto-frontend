import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Can } from "./can";

describe("Can", () => {
  it("renders children when the role has permission", () => {
    render(
      <Can role="agency" permission="campaign:write">
        <span>allowed</span>
      </Can>,
    );
    expect(screen.getByText("allowed")).toBeInTheDocument();
  });

  it("renders fallback when the role lacks permission", () => {
    render(
      <Can
        role="advertiser"
        permission="campaign:write"
        fallback={<span>denied</span>}
      >
        <span>allowed</span>
      </Can>,
    );
    expect(screen.getByText("denied")).toBeInTheDocument();
    expect(screen.queryByText("allowed")).not.toBeInTheDocument();
  });
});
