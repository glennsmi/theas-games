import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../config/firebase';
import { getChildren, addChild, deleteChild } from '../services/parentService';
import { getUserSubscription, getStripeBillingPortalUrl, isPremiumSubscription, UserSubscriptionData } from '../services/subscriptionService';
import { ChildProfile } from '@shared/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, User as UserIcon, Shield, CreditCard, CheckCircle, X, PartyPopper } from 'lucide-react';
import Avatar, { genConfig } from 'react-nice-avatar';

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChildName, setNewChildName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check for subscription success
    if (searchParams.get('subscription') === 'success') {
      setShowSuccessBanner(true);
      // Remove the query param from URL
      searchParams.delete('subscription');
      setSearchParams(searchParams, { replace: true });
    }
    
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [childrenData, subscriptionData] = await Promise.all([
        getChildren(user.uid),
        getUserSubscription(user.uid)
      ]);
      setChildren(childrenData);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChildren = async () => {
    if (!user) return;
    try {
      const data = await getChildren(user.uid);
      setChildren(data);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBillingPortal = () => {
    if (!user?.email) return;
    const billingUrl = getStripeBillingPortalUrl(user.email);
    window.open(billingUrl, '_blank');
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newChildName.trim()) return;

    setIsAdding(true);
    try {
      // Generate a random avatar for the new child
      const randomAvatar = JSON.stringify(genConfig());
      
      await addChild(user.uid, {
        displayName: newChildName,
        avatarConfig: randomAvatar
      });
      
      setNewChildName('');
      loadChildren();
    } catch (error) {
      console.error('Failed to add child:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!user || !window.confirm('Are you sure you want to remove this profile? Progress will be lost.')) return;
    
    try {
      await deleteChild(user.uid, childId);
      setChildren(prev => prev.filter(c => c.id !== childId));
    } catch (error) {
      console.error('Failed to delete child:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medium-teal" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <Card className="bg-gradient-to-r from-medium-teal to-light-teal border-none shadow-xl overflow-hidden">
            <CardContent className="py-6 relative">
              <button 
                onClick={() => setShowSuccessBanner(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <PartyPopper className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    🎉 Welcome to Premium!
                  </h2>
                  <p className="text-white/90 mb-4">
                    Thank you for subscribing! Your family now has full access to all games, 
                    unlimited avatar customization, and exclusive premium features.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button 
                      onClick={handleOpenBillingPortal}
                      variant="secondary"
                      className="bg-white text-medium-teal hover:bg-white/90"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>
                    <Button 
                      onClick={() => navigate('/')}
                      variant="ghost"
                      className="text-white border-white/30 border hover:bg-white/10"
                    >
                      Start Playing 🎮
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">Parent Dashboard</h1>
          <p className="text-dark-navy/60">Manage your family's profiles and subscription</p>
        </div>
        <div className="flex gap-2">
          {isPremiumSubscription(subscription) && (
            <Button 
              onClick={handleOpenBillingPortal}
              variant="outline"
              className="border-medium-teal text-medium-teal hover:bg-medium-teal hover:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          )}
          <Button 
            onClick={() => navigate('/subscription')} 
            variant="outline"
            className="border-bright-coral text-bright-coral hover:bg-bright-coral hover:text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            {isPremiumSubscription(subscription) ? 'View Plans' : 'Upgrade to Premium'}
          </Button>
        </div>
      </div>

      {/* Subscription Status Banner */}
      {subscription && (
        <Card className={`mb-8 ${isPremiumSubscription(subscription) ? 'bg-gradient-to-r from-medium-teal/10 to-light-teal/10 border-medium-teal' : 'bg-gradient-to-r from-bright-coral/10 to-warm-sand/10 border-bright-coral'}`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${isPremiumSubscription(subscription) ? 'bg-medium-teal/20' : 'bg-bright-coral/20'}`}>
                  {isPremiumSubscription(subscription) ? (
                    <Shield className="w-6 h-6 text-medium-teal" />
                  ) : (
                    <Shield className="w-6 h-6 text-bright-coral" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-dark-navy">
                    {isPremiumSubscription(subscription) ? '🌟 Premium Plan' : 'Free Plan'}
                  </p>
                  {isPremiumSubscription(subscription) && subscription.currentPeriodEnd && (
                    <p className="text-sm text-dark-navy/60">
                      {subscription.cancelAtPeriodEnd 
                        ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                        : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      }
                    </p>
                  )}
                  {!isPremiumSubscription(subscription) && (
                    <p className="text-sm text-dark-navy/60">Upgrade for unlimited access to all games!</p>
                  )}
                </div>
              </div>
              {isPremiumSubscription(subscription) && (
                <Button 
                  onClick={handleOpenBillingPortal}
                  variant="ghost"
                  size="sm"
                  className="text-medium-teal hover:bg-medium-teal/10"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Child Section */}
        <Card className="bg-white/80 border-2 border-dashed border-pale-aqua">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Profile
            </CardTitle>
            <CardDescription>Create a profile for your child</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddChild} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="childName">Child's Name</Label>
                <Input
                  id="childName"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Tommy"
                  disabled={isAdding}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-medium-teal hover:bg-light-teal text-white"
                disabled={isAdding || !newChildName.trim()}
              >
                {isAdding ? <Loader2 className="animate-spin w-4 h-4" /> : 'Create Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Children List */}
        {children.map((child) => (
          <Card key={child.id} className="bg-white hover:shadow-lg transition-shadow border-pale-aqua">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{child.displayName}</CardTitle>
              <div className="h-8 w-8">
                {child.avatarConfig ? (
                  <Avatar className="w-full h-full rounded-full" {...JSON.parse(child.avatarConfig)} />
                ) : (
                  <UserIcon className="w-full h-full p-1 bg-gray-100 rounded-full" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mt-2">
                <p>Stars Earned: {child.totalStars || 0} ⭐</p>
                <p>Games Unlocked: {child.unlockedGames?.length || 3}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => navigate(`/profile?childId=${child.id}`)}>
                Edit Profile
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteChild(child.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
