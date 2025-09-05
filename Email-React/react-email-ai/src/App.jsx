import { useState } from 'react'
import { Container, Typography, Box, TextField, FormControl, InputLabel, MenuItem , Select, Button, CircularProgress} from '@mui/material'
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const handleSubmit = async () =>{
    setLoading(true);

    try{
      const response = await fetch("http://localhost:8080/api/v1/ollama-model/generate-email",{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: tone
        })
      });
      const data = await response.text()
      setGeneratedReply(data)
      setLoading(false)
    }catch(error){
      setError("Failed To Generate Email Reply. Please Try Again!"+ error);
      console.error(error)
      setLoading(false)
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label='Original Email Content'
          value={emailContent || ''}
          sx={{ mb: 2 }}
          onChange={(e) => setEmailContent(e.target.value)} />
        <FormControl fullWidth>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={e => setTone(e.target.value)}>
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='profesional' >Professional</MenuItem>
              <MenuItem value='casual'>Casual</MenuItem>
              <MenuItem value='friendly'>Friendly</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{mt:6}}
          fullWidth
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}>
            {loading ? <CircularProgress size={24}/> : "Generate Reply"}
        </Button>
      </Box>
      {error && (
        <Typography color='error' sx={{mt:6}}>
          {error}
        </Typography>
      )}
      {generatedReply &&(
        <Box>
          <Typography>
            Generated Reply: 
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={generatedReply || ''}
            inputProps={{readOnly: true}}/>
          <Button
            variant='outlined'
            onClick={()=> navigator.clipboard.writeText(generatedReply)}>
            Copy To ClipBoard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App
