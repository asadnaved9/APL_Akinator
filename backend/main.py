from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="IPL Akinator AI API",
    description="Backend API for the IPL AI Akinator game using Bayesian inference and entropy selection.",
    version="1.0.0"
)

# CORS configuration
# Using a permissive configuration for local development. Adjust for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(router, prefix="/api", tags=["Akinator Game"])

@app.get("/")
async def root():
    return {"message": "Welcome to the IPL AI Akinator API. Go to /docs for the Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    # Start the server: uvicorn main:app --reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
