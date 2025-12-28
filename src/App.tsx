import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkle, Heart, Trash, Shuffle, Smiley, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'

interface NonsenseItem {
  id: string
  text: string
  timestamp: number
  type: string
}

const NONSENSE_WORDS = [
  ['purple', 'invisible', 'backwards', 'electric', 'wobbly', 'quantum', 'melodic', 'suspicious', 'inflatable', 'magnetic'],
  ['elephant', 'calculator', 'banana', 'philosophy', 'refrigerator', 'saxophone', 'algorithm', 'spatula', 'dimension', 'waffle'],
  ['dancing', 'contemplating', 'juggling', 'harmonizing', 'materializing', 'vibrating', 'fermented', 'encrypted', 'levitating', 'mumbling'],
  ['in zero gravity', 'during breakfast', 'backwards through time', 'with extreme prejudice', 'in perfect synchronization', 'against all odds', 'in morse code', 'underwater', 'accidentally', 'professionally']
]

const MOODS = [
  { name: 'Ecstatic', emoji: '✨🎉🌟', transform: (text: string) => text.toUpperCase() + '!!!!!!!!' },
  { name: 'Devastated', emoji: '😭💔🌧️', transform: (text: string) => text.toLowerCase() + '...........' },
  { name: 'Mysterious', emoji: '🔮👁️🌙', transform: (text: string) => '~' + text.split('').join('~') + '~' },
  { name: 'Chaotic', emoji: '🔥⚡🌪️', transform: (text: string) => text.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('') },
  { name: 'Robotic', emoji: '🤖💾⚙️', transform: (text: string) => '[BEEP] ' + text.toUpperCase().replace(/ /g, '_') + ' [BOOP]' },
  { name: 'Fancy', emoji: '🎩✨🍷', transform: (text: string) => 'Indeed, ' + text + ', quite.' }
]

function App() {
  const [savedNonsense, setSavedNonsense] = useKV<NonsenseItem[]>('nonsense-collection', [])
  const [currentNonsense, setCurrentNonsense] = useState<string>('')
  const [generateCount, setGenerateCount] = useState(0)
  const [wordCount, setWordCount] = useState(5)
  const [calculation, setCalculation] = useState('')
  const [calcResult, setCalcResult] = useState<string>('')
  const [calcExplanation, setCalcExplanation] = useState<string>('')
  const [moodText, setMoodText] = useState('')
  const [selectedMood, setSelectedMood] = useState(MOODS[0])
  const [translatedText, setTranslatedText] = useState('')

  const generateNonsense = () => {
    const allWords = NONSENSE_WORDS.flat()
    const words: string[] = []
    
    for (let i = 0; i < wordCount; i++) {
      words.push(allWords[Math.floor(Math.random() * allWords.length)])
    }
    
    const nonsense = words.join(' ')
    setCurrentNonsense(nonsense)
    setGenerateCount(generateCount + 1)
    
    if (generateCount === 99) {
      toast.error('You might need a break from the chaos! 🌀', {
        description: 'But who are we to stop you...'
      })
    }
  }

  const saveNonsense = () => {
    if (!currentNonsense) return
    
    const newItem: NonsenseItem = {
      id: Date.now().toString(),
      text: currentNonsense,
      timestamp: Date.now(),
      type: 'generated'
    }
    
    setSavedNonsense((current) => [newItem, ...(current || [])])
    toast.success('Nonsense preserved for eternity! ✨')
  }

  const deleteNonsense = (id: string) => {
    setSavedNonsense((current) => (current || []).filter(item => item.id !== id))
    toast('Nonsense obliterated! 💥')
  }

  const calculateWrong = () => {
    if (!calculation) return
    
    const wrongAnswers = ['🦆', '∞', '-0', 'potato', '42', 'yes', 'undefined', '🎺', 'purple', 'ERROR 418: I\'m a teapot']
    const explanations = [
      'According to quantum mechanics, numbers are just suggestions',
      'The calculator consulted a magic 8-ball',
      'Math is more of an art form, really',
      'In an alternate universe, this is correct',
      'The numbers told me this in a dream',
      'I used advanced backwards arithmetic',
      'This answer exists in the 5th dimension',
      'Trust me, I\'m a calculator'
    ]
    
    setCalcResult(wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)])
    setCalcExplanation(explanations[Math.floor(Math.random() * explanations.length)])
    toast('Calculation complete! (probably wrong)', {
      description: 'With 100% confidence'
    })
  }

  const translateMood = () => {
    if (!moodText) return
    const result = selectedMood.transform(moodText)
    setTranslatedText(`${selectedMood.emoji} ${result} ${selectedMood.emoji}`)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Nonsense Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Where logic takes a vacation and chaos reigns supreme ✨
          </p>
        </motion.div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="generator">
              <Sparkle className="mr-2" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Lightning className="mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="mood">
              <Smiley className="mr-2" />
              Mood
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6 mt-6">
            <Card className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Random Nonsense Generator
                </h2>
                <p className="text-muted-foreground">
                  Generate beautifully meaningless combinations
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Word Count: {wordCount}
                    </label>
                    <Badge variant="secondary">{wordCount} words</Badge>
                  </div>
                  <Slider
                    value={[wordCount]}
                    onValueChange={(value) => setWordCount(value[0])}
                    min={5}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 words</span>
                    <span>10 words</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={generateNonsense}
                    size="lg"
                    className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Shuffle className="mr-2" />
                    Make Nonsense
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentNonsense && (
                  <motion.div
                    key={currentNonsense}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="bg-primary/10 p-8 rounded-xl border-2 border-primary/30"
                  >
                    <p className="text-2xl md:text-3xl font-medium text-center text-card-foreground">
                      {currentNonsense}
                    </p>
                    <div className="flex justify-center mt-6">
                      <Button onClick={saveNonsense} variant="outline">
                        <Heart className="mr-2" />
                        Save This Nonsense
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="secondary">
                  {generateCount} pieces of nonsense created
                </Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Your Collection of Chaos
                </h3>
                <Badge>{savedNonsense?.length || 0}</Badge>
              </div>
              
              <Separator />

              {!savedNonsense || savedNonsense.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl animate-float">🎨</div>
                  <p className="text-lg text-muted-foreground">
                    Create Your First Masterpiece of Chaos
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {savedNonsense.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card/50 p-4 rounded-lg border border-border flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <p className="text-card-foreground font-medium">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNonsense(item.id)}
                        >
                          <Trash />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6 mt-6">
            <Card className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Backwards Calculator
                </h2>
                <p className="text-muted-foreground">
                  Computing wrong answers with unwavering confidence
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  id="calculation"
                  placeholder="Enter any calculation (e.g., 2 + 2)"
                  value={calculation}
                  onChange={(e) => setCalculation(e.target.value)}
                  className="text-lg p-6"
                  onKeyDown={(e) => e.key === 'Enter' && calculateWrong()}
                />
                
                <Button
                  onClick={calculateWrong}
                  className="w-full py-6 text-lg"
                  disabled={!calculation}
                >
                  <Lightning className="mr-2" />
                  Calculate (Incorrectly)
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {calcResult && (
                  <motion.div
                    key={calcResult}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="space-y-4"
                  >
                    <div className="bg-secondary/20 p-8 rounded-xl border-2 border-secondary text-center">
                      <p className="text-sm text-muted-foreground mb-2">Result:</p>
                      <p className="text-5xl font-bold text-secondary-foreground">
                        {calcResult}
                      </p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                      <p className="text-sm text-muted-foreground mb-1">Explanation:</p>
                      <p className="text-accent-foreground/80 italic">{calcExplanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6 mt-6">
            <Card className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Mood Translator
                </h2>
                <p className="text-muted-foreground">
                  Transform mundane sentences into theatrical performances
                </p>
              </div>

              <div className="space-y-4">
                <Textarea
                  id="mood-text"
                  placeholder="Enter a normal, boring sentence..."
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  className="min-h-[100px] text-lg"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MOODS.map((mood) => (
                    <Button
                      key={mood.name}
                      variant={selectedMood.name === mood.name ? 'default' : 'outline'}
                      onClick={() => setSelectedMood(mood)}
                      className="h-auto py-3 flex flex-col items-center gap-1"
                    >
                      <span className="text-xl">{mood.emoji.split('')[0]}</span>
                      <span className="text-sm">{mood.name}</span>
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={translateMood}
                  className="w-full py-6 text-lg"
                  disabled={!moodText}
                >
                  <Sparkle className="mr-2" />
                  Translate to {selectedMood.name}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {translatedText && (
                  <motion.div
                    key={translatedText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="bg-accent/10 p-6 rounded-xl border-2 border-accent/30"
                  >
                    <p className="text-xl md:text-2xl font-medium text-center break-words">
                      {translatedText}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        navigator.clipboard.writeText(translatedText)
                        toast.success('Copied to clipboard! 📋')
                      }}
                    >
                      Copy Result
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
