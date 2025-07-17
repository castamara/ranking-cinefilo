import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);

            if (!supabaseUrl || !supabaseAnonKey) {
                setError("Las claves de Supabase no están configuradas en Vercel.");
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('movies')
                .select('*');

            if (error) {
                console.error('Error fetching data:', error);
                setError(`Error al cargar datos: ${error.message}`);
                setMovies([]);
            } else {
                setMovies(data);
            }
            setIsLoading(false);
        };
        
        fetchMovies();
    }, []);

    if (isLoading) {
        return <h1>Cargando películas desde Supabase...</h1>;
    }

    if (error) {
        return <h1 style={{ color: 'red' }}>Error: {error}</h1>;
    }

    if (movies.length === 0) {
        return <h1>No se encontraron películas. ¿Has añadido datos a tu tabla 'movies' en Supabase?</h1>;
    }

    return (
        <div>
            <h1>Ranking cinéfilo a la Güil</h1>
            <hr />
            {movies.map(movie => (
                <div key={movie.id} style={{ border: '1px solid grey', margin: '10px', padding: '10px' }}>
                    <h2>{movie.title} ({movie.year})</h2>
                    <p>Director: {movie.director}</p>
                    <p>Género: {movie.genre}</p>
                    <p>IMDb: {movie.ratings?.imdb}</p>
                </div>
            ))}
        </div>
    );
}

export default App;
