import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Plus, Trash2, Globe, Twitter, Mail, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DomainRecord {
  type: string;
  value: string;
}

interface DomainRecords {
  twitter?: string;
  website?: string;
  email?: string;
  ipfs?: string;
  bio?: string;
  [key: string]: string | undefined;
}

interface DomainRecordManagerProps {
  domainName: string;
  records: DomainRecords;
  onSave: (records: DomainRecords) => Promise<boolean>;
}

export default function DomainRecordManager({ domainName, records: initialRecords, onSave }: DomainRecordManagerProps) {
  const { toast } = useToast();
  const [records, setRecords] = useState<DomainRecords>(initialRecords);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newRecordType, setNewRecordType] = useState("");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [showAddRecord, setShowAddRecord] = useState(false);

  // Standard record types with icons
  const recordTypeIcons: {[key: string]: JSX.Element} = {
    twitter: <Twitter className="h-4 w-4" />,
    website: <Globe className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    bio: <BookOpen className="h-4 w-4" />,
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setRecords(initialRecords);
    setShowAddRecord(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSave(records);
      if (success) {
        setEditMode(false);
        setShowAddRecord(false);
        toast({
          title: "Records updated",
          description: "Domain records have been successfully updated",
        });
      } else {
        throw new Error("Failed to save records");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update domain records. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRecordChange = (type: string, value: string) => {
    setRecords(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleRemoveRecord = (type: string) => {
    const newRecords = { ...records };
    delete newRecords[type];
    setRecords(newRecords);
  };

  const handleAddRecord = () => {
    if (!newRecordType || !newRecordValue) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both type and value for the new record",
      });
      return;
    }

    if (records[newRecordType]) {
      toast({
        variant: "destructive",
        title: "Record exists",
        description: `A record of type '${newRecordType}' already exists`,
      });
      return;
    }

    setRecords(prev => ({
      ...prev,
      [newRecordType]: newRecordValue
    }));

    setNewRecordType("");
    setNewRecordValue("");
    setShowAddRecord(false);
  };

  return (
    <Card className="domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Record Manager for {domainName.split('.')[0]}<span className="text-solana-teal">.sol</span>
        </CardTitle>
        {!editMode ? (
          <Button 
            variant="outline"
            onClick={handleEdit}
            className="flex items-center"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Records
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              onClick={handleCancelEdit}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="solana-gradient flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(records).length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <p>No records set for this domain</p>
            </div>
          )}
          
          {Object.entries(records).map(([type, value]) => (
            <div key={type} className="p-3 border border-white/10 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/10 p-2 rounded">
                    {recordTypeIcons[type] || <Globe className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{type}</p>
                    {!editMode ? (
                      <p className="text-sm text-gray-400 mt-1 break-all">{value}</p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={value}
                          onChange={(e) => handleRecordChange(type, e.target.value)}
                          className="bg-white/5 border-white/20 text-sm search-bar"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {editMode && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRemoveRecord(type)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {editMode && showAddRecord && (
            <div className="p-4 border border-dashed border-white/20 rounded-lg">
              <h3 className="font-medium mb-3">Add New Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="record-type" className="text-sm mb-1 block">Record Type</Label>
                  <Input
                    id="record-type"
                    placeholder="e.g. discord, github"
                    value={newRecordType}
                    onChange={(e) => setNewRecordType(e.target.value)}
                    className="bg-white/5 border-white/20 search-bar"
                  />
                </div>
                <div>
                  <Label htmlFor="record-value" className="text-sm mb-1 block">Record Value</Label>
                  <Input
                    id="record-value"
                    placeholder="e.g. username or URL"
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                    className="bg-white/5 border-white/20 search-bar"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddRecord(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddRecord}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Record
                </Button>
              </div>
            </div>
          )}
          
          {editMode && !showAddRecord && (
            <Button
              variant="outline"
              onClick={() => setShowAddRecord(true)}
              className="w-full border-dashed flex items-center justify-center py-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Record
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}