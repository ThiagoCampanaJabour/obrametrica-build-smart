import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

const uploadSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  author: z.string().min(2, 'Nome do autor é obrigatório'),
  sourceUrl: z.string().url('Insira uma URL válida da fonte original'),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(20, 'Forneça uma breve descrição (mín. 20 caracteres)'),
  licenseConfirmed: z.literal(true, {
    errorMap: () => ({ message: 'Você deve confirmar que o material é de domínio público ou CC0' }),
  }),
  email: z.string().email('E-mail inválido'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function PlantUploadForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      author: '',
      sourceUrl: '',
      category: '',
      description: '',
      licenseConfirmed: false as unknown as true,
      email: '',
    },
  });


  async function onSubmit(data: UploadFormValues) {
    setIsSubmitting(true);
    try {
      // Usando Formspree (mesmo e-mail do contato principal conforme histórico)
      const response = await fetch('https://formspree.io/f/mqakbvzy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: `Sugestão de Planta: ${data.title}`,
          ...data
        }),
      });

      if (response.ok) {
        toast.success('Sugestão enviada com sucesso! Nossa equipe analisará o material.');
        form.reset();
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      toast.error('Erro ao enviar sugestão. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Sugerir Novo Projeto</h3>
        <p className="text-sm text-muted-foreground">
          Conhece uma planta em domínio público ou quer disponibilizar seu próprio projeto CC0?
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Planta Casa Popular 2 Quartos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor/Fonte</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva ou Prefeitura de X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Fonte Original (ou Portfólio)</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com/projeto" {...field} />
                </FormControl>
                <FormDescription>Link onde o arquivo original pode ser verificado.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Residencial">Residencial</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Galpões">Galpões</SelectItem>
                      <SelectItem value="Complementares">Complementares (Elétrica/Hidro)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu E-mail (para contato)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Curta</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva brevemente o que está incluído no projeto..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseConfirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Confirmo que este projeto é de Domínio Público ou possui licença Creative Commons (CC0).
                  </FormLabel>
                  <FormDescription>
                    O ObraMétrica não aceita material pirata ou com direitos autorais restritos.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Sugestão para Análise
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
