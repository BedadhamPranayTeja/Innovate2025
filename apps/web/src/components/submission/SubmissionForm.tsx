import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  X,
  Save,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubmissionStore } from "@/stores/submissionStore";
import { useTeamStore } from "@/stores/teamStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const step1Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
});

const step2Schema = z.object({
  problemStatement: z.string().min(50, "Problem statement must be at least 50 characters").max(1000),
  solution: z.string().min(50, "Solution must be at least 50 characters").max(1000),
});

const step3Schema = z.object({
  repoUrl: z.string().url("Must be a valid URL"),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const steps = [
  { title: "Basics", description: "Project title and overview" },
  { title: "Details", description: "Problem & solution" },
  { title: "Links", description: "Repository and demo" },
  { title: "Review", description: "Review and submit" },
];

export function SubmissionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { createSubmission, submitFinal, saveDraft } = useSubmissionStore();
  const { myTeam } = useTeamStore();

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { title: "", description: "" },
  });

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: { problemStatement: "", solution: "" },
  });

  const step3Form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: { repoUrl: "", demoUrl: "", videoUrl: "" },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !techStack.includes(tech) && techStack.length < 8) {
      setTechStack([...techStack, tech]);
      setTechInput("");
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
    } else if (currentStep === 1) {
      const valid = await step2Form.trigger();
      if (!valid) return;
    } else if (currentStep === 2) {
      const valid = await step3Form.trigger();
      if (!valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = () => {
    const data = {
      ...step1Form.getValues(),
      ...step2Form.getValues(),
      ...step3Form.getValues(),
      techStack,
    };
    saveDraft(data);
    toast.success("Draft saved!");
  };

  const handleSubmit = async () => {
    if (!myTeam) {
      toast.error("You must be in a team to submit");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        ...step1Form.getValues(),
        ...step2Form.getValues(),
        ...step3Form.getValues(),
        techStack,
        team: myTeam,
      };

      const submission = await createSubmission(myTeam.id, data);
      await submitFinal(submission.id);

      toast.success("Submission successful!", {
        description: "Your project has been submitted for judging.",
      });

      navigate("/submissions");
    } catch (error) {
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allData = {
    ...step1Form.getValues(),
    ...step2Form.getValues(),
    ...step3Form.getValues(),
    techStack,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Submit Your Project</h1>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`text-center ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-2 border-primary"
                    : "border-2 border-muted"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <Form {...step1Form}>
                  <form className="space-y-4">
                    <FormField
                      control={step1Form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="EduAI - Smart Learning Platform" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step1Form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief overview of your project..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be shown on the submission card
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}

              {currentStep === 1 && (
                <Form {...step2Form}>
                  <form className="space-y-4">
                    <FormField
                      control={step2Form.control}
                      name="problemStatement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Statement</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What problem does your project solve?"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step2Form.control}
                      name="solution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Solution</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How does your project solve this problem?"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <FormLabel>Tech Stack</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add technology (e.g., React)"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTech();
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={addTech}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {techStack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="gap-1">
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </form>
                </Form>
              )}

              {currentStep === 2 && (
                <Form {...step3Form}>
                  <form className="space-y-4">
                    <FormField
                      control={step3Form.control}
                      name="repoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repository URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step3Form.control}
                      name="demoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demo URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-demo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step3Form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} />
                          </FormControl>
                          <FormDescription>
                            A demo video or pitch (YouTube, Loom, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                      <p className="font-medium">{allData.title || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                      <p>{allData.description || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Problem Statement</h4>
                      <p className="text-sm">{allData.problemStatement || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Solution</h4>
                      <p className="text-sm">{allData.solution || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {allData.techStack.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                        {allData.techStack.length === 0 && (
                          <span className="text-muted-foreground">None added</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Repository</h4>
                      <p className="text-sm font-mono">{allData.repoUrl || "Not set"}</p>
                    </div>
                    {allData.demoUrl && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Demo</h4>
                        <p className="text-sm font-mono">{allData.demoUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Project
          </Button>
        )}
      </div>
    </div>
  );
}
