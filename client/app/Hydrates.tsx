'use client'

import { Hydrate } from "@tanstack/react-query";

export default function Hydrates(props: any) {
  return <Hydrate {...props} />;
}
