
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GeneralInfoProvider } from "./Context/Context";
import AppRouter from "./routes/AppRoutes";

 const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
   root.render(
    <QueryClientProvider client={queryClient}>
         <GeneralInfoProvider>
                  <AppRouter />
                  <ReactQueryDevtools/>
         </GeneralInfoProvider>
       </QueryClientProvider>
  
  );
 