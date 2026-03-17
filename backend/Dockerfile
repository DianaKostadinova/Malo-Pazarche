# Use .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Copy csproj and restore dependencies
COPY MaloPazarche.csproj ./
RUN dotnet restore

# Install dotnet-ef tool globally
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy all source code
COPY . ./

EXPOSE 5000

# Run migrations then start API
CMD ["bash", "-c", "dotnet ef database update && dotnet run --urls http://+:5000"]