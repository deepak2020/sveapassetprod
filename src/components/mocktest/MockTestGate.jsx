import { useEffect, useState } from "react";
import { Clock, Loader2, Lock, Send, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import LoginGate from "@/components/shared/LoginGate";

const Spinner = () => (
  <div className="flex justify-center py-20">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

const Card = ({ icon: Icon, title, children }) => (
  <div className="max-w-xl mx-auto px-4 py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-muted-foreground" />
    </div>
    <h1 className="font-display text-2xl font-bold mb-2">{title}</h1>
    <div className="text-muted-foreground space-y-4">{children}</div>
  </div>
);

export default function MockTestGate({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [access, setAccess] = useState(undefined); // undefined = loading, null = no request yet
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    base44.entities.MockTestAccess.filter({ user_email: user.email }).then((res) => {
      const list = Array.isArray(res) ? res : res?.items || [];
      const latest = [...list].sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""))[0];
      setAccess(latest || null);
    });
  }, [isAuthenticated, user?.email]);

  if (isLoadingAuth || !authChecked) return <Spinner />;

  if (!isAuthenticated) {
    return <LoginGate message="Provtestet kräver åtkomst. Logga in och begär åtkomst.">{children}</LoginGate>;
  }

  if (user?.role === "admin") return children;

  if (access === undefined) return <Spinner />;
  if (access?.status === "approved") return children;

  const requestAccess = async () => {
    setSending(true);
    const rec = await base44.entities.MockTestAccess.create({
      user_email: user.email,
      user_name: user.full_name,
      status: "pending",
    });
    setAccess(rec);
    setSending(false);
  };

  if (access?.status === "pending") {
    return (
      <Card icon={Clock} title="Din begäran väntar">
        <p>Vi har tagit emot din begäran om åtkomst till provtestet. Du får tillgång så snart den har godkänts.</p>
        <p className="text-sm italic">Your request is waiting to be approved.</p>
      </Card>
    );
  }

  const rejected = access?.status === "rejected";

  return (
    <Card icon={rejected ? XCircle : Lock} title="Provtestet kräver åtkomst">
      {rejected && <p>Din tidigare begäran godkändes inte. Du kan skicka en ny begäran.</p>}
      <p>Provtestet är bara för elever som har fått åtkomst. Skicka en begäran, så öppnas provet så snart den godkänts.</p>
      <p className="text-sm italic">This mock test is only for users who have been granted access.</p>
      <Button onClick={requestAccess} disabled={sending} className="gap-2">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Begär åtkomst
      </Button>
    </Card>
  );
}